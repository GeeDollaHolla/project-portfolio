import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import sleep from 'sleep-promise'
import { useWindowSize } from 'react-use'

import { ProjectItem, CategoryItem, SkillItem } from '../../types'
import NodePositioner from './NodePositioner'
import ProjectDetails from './ProjectDetails'
import { useSunburstDimensioning, projectHeaderHeight } from './dimensioning'
import useSunburstData from './dataGenerator'
import stateService from './state'

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
}

interface ProjectSkill {
	id: string
	name: string
}

const Sunburst = (props: Props) => {
	const { allCategories, allSkills, projects } = props

	/** Track which Node user is currently hovering over */
	const currentHoverNode: { current: { id: string; type: string } } = useRef(null)

	/** Project the user is hovering over */
	const [hoveringProjectId, setHoveringProjectId] = useState(null as string)
	/** Selected project to show more details */
	const [selectedProject, setSelectedProject] = useState(null as ProjectItem)
	/** track when Nodes are moving to prevent additional hover-renders */
	const [nodesAreMoving, setNodesAreMoving] = useState(null as boolean)
	/** track when Nodes are in a hover transition to prevent additional hover-renders */
	const [inHoverTransition, setInHoverTransition] = useState(false as boolean)
	/** Array of projectSkills that are selected to show more detail */
	const [selectedProjectSkills, setSelectedProjectSkills] = useState(null as ProjectSkill[])
	/** Category id that is currently being hovered over */
	const [hoverCategoryId, setHoverCategoryId] = useState(null as string)
	/** Amount to scale the sunburst */
	const [sunburstScale, setSunburstScale] = useState(1 as number)
	/** Amount to scale the sunburst */
	const [selectedCategoryId, setSelectedCategoryId] = useState(null as string)

	const { width: screenWidth } = useWindowSize()
	const { projectDetailsPositioning, sunburstPosition, radiuses } = useSunburstDimensioning(screenWidth, selectedCategoryId)
	const sunburstData = useSunburstData(allCategories, allSkills, projects)

	/**
	 * Method called after user hovers over a node
	 * @param id - Node id
	 * @param type - Type of node - category, skill or project
	 */
	const hoverNode = (id: string, type: string) => {
		currentHoverNode.current = { id, type }
		return
		if (type !== 'project') return
		if (nodesAreMoving || inHoverTransition) return

		setHoveringProjectId(currentHoverNode.current.id)

		setInHoverTransition(true)
		setTimeout(() => {
			setHoveringProjectId(currentHoverNode.current ? currentHoverNode.current.id : null)
			setInHoverTransition(false)
		}, 300)
	}

	/** Method called after leaving the Sunburst */
	const leaveSunburstTimeout = useRef(null)
	const leaveSunburst = () => {
		currentHoverNode.current = null
		setHoveringProjectId(null)
		clearTimeout(leaveSunburstTimeout.current)
		leaveSunburstTimeout.current = setTimeout(() => {
			if (!currentHoverNode.current) setHoverCategoryId(null)
		}, 2000)
	}

	/**
	 * Method called after user clicks a node
	 * @param id Node id
	 * @param type Type of node - category, skill or project
	 */
	const selectNode = async (id: string, type: string) => {
		console.log('id: ', id)
		return
		if (nodesAreMoving) return
		if (type !== 'project') return

		if (selectedProject) {
			// prevent selecting already selected project skill
			if (selectedProject.id === id) return
			// Close current project first and rerun with new project
			else {
				setSelectedProject(null)
				setSelectedProjectSkills(null)
				await sleep(300)
			}
		}

		// Find selected project and create list of project skills from selected project
		const newSelectedProject = props.projects.find(project => project.id === id)

		const projectSkills = newSelectedProject.skills.items.map(projectSkill => {
			const name = allSkills.find(skill => skill.id === projectSkill.skillId).name
			return { id: projectSkill.id, name }
		})

		// Add first project skill to selectedProjectSkills
		let newSelectedProjectSkills: ProjectSkill[] = [projectSkills[0]]
		setHoveringProjectId(null)
		setSelectedProject(newSelectedProject)
		setNodesAreMoving(projectSkills.length < 2 ? false : true)
		setSelectedProjectSkills(newSelectedProjectSkills)

		// Slowly add project skills to selectedProjectSkills
		if (projectSkills.length < 2) return
		let i = 1
		let projectSkillInterval = setInterval(() => {
			newSelectedProjectSkills = [...newSelectedProjectSkills, projectSkills[i]]
			setSelectedProjectSkills(newSelectedProjectSkills)
			i++
			if (i === projectSkills.length) {
				setNodesAreMoving(false)
				clearInterval(projectSkillInterval)
			}
		}, 100)
	}

	const handleCategoryHover = categoryId => {
		if (!selectedCategoryId) {
			setHoverCategoryId(categoryId)
		}
	}

	const handleCategorySelect = categoryId => {
		if (selectedCategoryId) {
			setSunburstScale(1)
			setSelectedCategoryId(null)
		} else {
			setSunburstScale(0.7)
			setSelectedCategoryId(categoryId)
		}
	}

	if (sunburstData.length === 0) return <h3>Loading...</h3>

	let categoryRotation = 0

	return (
		<div
			onMouseLeave={leaveSunburst}
			style={{
				position: 'absolute',
				transform: `translate(${sunburstPosition.x}px, ${sunburstPosition.y}px) scale(${sunburstScale})`,
				transition: 'all 500ms',
			}}
		>
			{sunburstData.map((category, categoryI) => {
				// Rotation logic for skills
				if (categoryI > 0) categoryRotation += sunburstData[categoryI - 1].phi / 2 + category.phi / 2
				let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

				let transform = null
				if (selectedCategoryId === category.id) {
					const translateAmount = 0
					transform = `translate(
						${translateAmount * Math.cos(categoryRotation)}px, 
						${translateAmount * Math.sin(categoryRotation)}px
					)`
				} else if (hoverCategoryId === category.id) {
					const translateAmount = 40
					transform = `translate(
						${translateAmount * Math.cos(categoryRotation)}px, 
						${translateAmount * Math.sin(categoryRotation)}px
					)`
				}

				const categoryStyle: React.CSSProperties = {
					position: 'absolute',
					transform,
					transition: 'all 500ms',
				}

				let selectedCategory = null
				if (selectedCategoryId === category.id) {
					selectedCategory = { phi: category.phi, projectCount: category.projectCount }
				}

				return (
					<div
						key={category.id}
						onMouseEnter={() => handleCategoryHover(category.id)}
						onMouseDown={() => handleCategorySelect(category.id)}
						style={categoryStyle}
					>
						<NodePositioner
							type="category"
							data={[category]}
							innerRadius={radiuses.category}
							outerRadius={radiuses.skill}
							itemRotation={categoryRotation}
							fontSize={14}
							hoveringProjectId={hoveringProjectId}
							hoverNode={hoverNode}
							selectNode={selectNode}
							selectedCategory={selectedCategory}
						/>

						<NodePositioner
							type="skill"
							data={category.skills}
							innerRadius={radiuses.skill}
							outerRadius={radiuses.project}
							itemRotation={skillRotation}
							fontSize={12}
							hoveringProjectId={hoveringProjectId}
							hoverNode={hoverNode}
							selectNode={selectNode}
							selectedCategory={selectedCategory}
						/>

						{category.skills.map((skill, skillI) => {
							// Rotation logic for projects
							if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
							const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

							return (
								<React.Fragment key={skill.id}>
									<NodePositioner
										type="project"
										data={skill.projects}
										innerRadius={radiuses.project}
										outerRadius={radiuses.outer}
										itemRotation={projectRotation}
										fontSize={10}
										hoveringProjectId={hoveringProjectId}
										hoverNode={hoverNode}
										selectNode={selectNode}
										selectedProject={selectedProject}
										selectedProjectSkills={selectedProjectSkills}
										projectDetailsPositioning={projectDetailsPositioning}
										selectedCategory={selectedCategory}
									/>
								</React.Fragment>
							)
						})}
					</div>
				)
			})}

			<ProjectDetails
				projectDetailsPositioning={projectDetailsPositioning}
				selectedProject={selectedProject}
				selectedProjectSkills={selectedProjectSkills}
				projectHeaderHeight={projectHeaderHeight}
			/>
		</div>
	)
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
