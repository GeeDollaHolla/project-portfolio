import React, { useMemo } from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'

interface Props {
	/** Type of Node */
	type: 'category' | 'skill' | 'project'
	/** If used, change node into rectangle with given values, else take the shape to fit in Sunburst */
	rectangle?: { width: number; height: number }
	/** If used, change node into trapezoid with given values, else take the shape to fit in Sunburst */
	trapezoid?: { width: number; innerHeight: number; outerHeight: number }
	/** The displayed text */
	text: string
	/** Inner radius of the node */
	innerRadius: number
	/** The arc angle in degrees that determines the Node's width */
	phi: number
	/** Outer radius of the node */
	outerRadius: number
	/** For text */
	fontSize: number
	/** Color of Node */
	fill: string
	/** id of the Node - category, skill or project */
	id: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string, type: this['type']) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type']) => void
	/** Material UI withStyles classes object */
	classes: any
}

const styles = createStyles({
	svg: { position: 'absolute', overflow: 'visible' },
	svgPath: { transition: 'all 500ms' },
	textWrapper: { pointerEvents: 'none', position: 'absolute', paddingLeft: '5px' },
	text: { position: 'relative', top: '50%', transform: 'translateY(-50%)' },
})

const Node = (props: Props) => {
	const {
		type,
		text,
		innerRadius,
		phi,
		outerRadius,
		fontSize,
		fill,
		id,
		hoverNode,
		selectNode,
		rectangle,
		trapezoid,
		classes,
	} = props

	let width, x1, x2, y1, y2, c1, c2
	let adjInnerRadius = innerRadius
	let adjOuterRadius = outerRadius

	if (trapezoid) {
		width = trapezoid.width
		x1 = 0
		x2 = width
		c1 = trapezoid.innerHeight
		c2 = trapezoid.outerHeight
		y1 = c1 / 2
		y2 = c2 / 2
		adjInnerRadius = 10000
		adjOuterRadius = 10000
	} else if (rectangle) {
		width = rectangle.width
		x1 = 0
		x2 = width
		c1 = rectangle.height
		c2 = c1
		y1 = c1 / 2
		y2 = c2 / 2
		adjInnerRadius = 10000
		adjOuterRadius = 10000
	} else {
		// Law of cosines to determine thickness at inner and outer radius
		const cosPhi = Math.cos(phi)
		c1 = Math.sqrt(2 * Math.pow(adjInnerRadius, 2) * (1 - cosPhi))
		c2 = Math.sqrt(2 * Math.pow(outerRadius, 2) * (1 - cosPhi))

		// Determine the node corners adjusting for margin
		width = outerRadius - innerRadius
		const margin = 1
		const alpha = (Math.PI - phi / 2) / 2
		const tanAlpha = Math.tan(alpha)
		x1 = -c1 / 2 / tanAlpha + margin
		x2 = width - c2 / 2 / tanAlpha - margin + 0.7 * phi
		y1 = c1 / 2 - margin
		y2 = c2 / 2 - margin - 0.7 * phi
	}

	const displayText = useMemo(() => {
		const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)
		return (
			<ResponsiveEllipsis
				className={classes.text}
				style={{ lineHeight: fontSize + 'px', fontSize }}
				text={text}
				maxLine={Math.floor(c1 / fontSize)}
				basedOn="letters"
			/>
		)
	}, [fontSize, text, rectangle])

	return (
		<div>
			<svg width={width} height={c2} className={classes.svg} pointerEvents="none">
				<path
					pointerEvents="visible"
					cursor="pointer"
					fill={fill}
					className={classes.svgPath}
					onMouseOver={() => hoverNode(id, type)}
					onMouseUp={() => selectNode(id, type)}
					d={`
						M${x1} ${-y1}
						A ${adjInnerRadius} ${adjInnerRadius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
						A ${adjOuterRadius} ${adjOuterRadius} 0 0 0 ${x2} ${-y2} 
						Z
					`}
				/>
			</svg>
			<div
				className={classes.textWrapper}
				style={{
					top: Math.floor(-c1 / 2) + 'px',
					height: c1 + 'px',
					width,
				}}
			>
				{displayText}
			</div>
		</div>
	)
}

export default withStyles(styles)(Node)
