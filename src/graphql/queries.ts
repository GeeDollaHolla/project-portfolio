// tslint:disable
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    APIkey
    email
    dirtyTables
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      APIkey
      email
      dirtyTables
    }
    nextToken
  }
}
`;
export const getProject = `query GetProject($id: ID!) {
  getProject(id: $id) {
    id
    userId
    date
    name
    company
    description
    skills {
      items {
        id
        userId
        project {
          id
          userId
          date
          name
          company
          description
          skills {
            items {
              id
              userId
              project {
                id
                userId
                date
                name
                company
                description
                skills {
                  items {
                    id
                    userId
                    project {
                      id
                      userId
                      date
                      name
                      company
                      description
                    }
                    description
                    skillId
                    toolIds
                  }
                  nextToken
                }
              }
              description
              skillId
              toolIds
            }
            nextToken
          }
        }
        description
        skillId
        toolIds
      }
      nextToken
    }
  }
}
`;
export const listProjects = `query ListProjects(
  $filter: ModelProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      date
      name
      company
      description
      skills {
        items {
          id
          userId
          project {
            id
            userId
            date
            name
            company
            description
            skills {
              items {
                id
                userId
                project {
                  id
                  userId
                  date
                  name
                  company
                  description
                  skills {
                    items {
                      id
                      userId
                      description
                      skillId
                      toolIds
                    }
                    nextToken
                  }
                }
                description
                skillId
                toolIds
              }
              nextToken
            }
          }
          description
          skillId
          toolIds
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getProjectSkill = `query GetProjectSkill($id: ID!) {
  getProjectSkill(id: $id) {
    id
    userId
    project {
      id
      userId
      date
      name
      company
      description
      skills {
        items {
          id
          userId
          project {
            id
            userId
            date
            name
            company
            description
            skills {
              items {
                id
                userId
                project {
                  id
                  userId
                  date
                  name
                  company
                  description
                  skills {
                    items {
                      id
                      userId
                      description
                      skillId
                      toolIds
                    }
                    nextToken
                  }
                }
                description
                skillId
                toolIds
              }
              nextToken
            }
          }
          description
          skillId
          toolIds
        }
        nextToken
      }
    }
    description
    skillId
    toolIds
  }
}
`;
export const listProjectSkills = `query ListProjectSkills(
  $filter: ModelProjectSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjectSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      project {
        id
        userId
        date
        name
        company
        description
        skills {
          items {
            id
            userId
            project {
              id
              userId
              date
              name
              company
              description
              skills {
                items {
                  id
                  userId
                  project {
                    id
                    userId
                    date
                    name
                    company
                    description
                    skills {
                      nextToken
                    }
                  }
                  description
                  skillId
                  toolIds
                }
                nextToken
              }
            }
            description
            skillId
            toolIds
          }
          nextToken
        }
      }
      description
      skillId
      toolIds
    }
    nextToken
  }
}
`;
export const getCategory = `query GetCategory($id: ID!) {
  getCategory(id: $id) {
    id
    userId
    name
    skills {
      items {
        id
        userId
        name
        category {
          id
          userId
          name
          skills {
            items {
              id
              userId
              name
              category {
                id
                userId
                name
                skills {
                  items {
                    id
                    userId
                    name
                    category {
                      id
                      userId
                      name
                    }
                  }
                  nextToken
                }
              }
            }
            nextToken
          }
        }
      }
      nextToken
    }
  }
}
`;
export const listCategorys = `query ListCategorys(
  $filter: ModelCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      skills {
        items {
          id
          userId
          name
          category {
            id
            userId
            name
            skills {
              items {
                id
                userId
                name
                category {
                  id
                  userId
                  name
                  skills {
                    items {
                      id
                      userId
                      name
                    }
                    nextToken
                  }
                }
              }
              nextToken
            }
          }
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getSkill = `query GetSkill($id: ID!) {
  getSkill(id: $id) {
    id
    userId
    name
    category {
      id
      userId
      name
      skills {
        items {
          id
          userId
          name
          category {
            id
            userId
            name
            skills {
              items {
                id
                userId
                name
                category {
                  id
                  userId
                  name
                  skills {
                    items {
                      id
                      userId
                      name
                    }
                    nextToken
                  }
                }
              }
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
}
`;
export const listSkills = `query ListSkills(
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      category {
        id
        userId
        name
        skills {
          items {
            id
            userId
            name
            category {
              id
              userId
              name
              skills {
                items {
                  id
                  userId
                  name
                  category {
                    id
                    userId
                    name
                    skills {
                      nextToken
                    }
                  }
                }
                nextToken
              }
            }
          }
          nextToken
        }
      }
    }
    nextToken
  }
}
`;
export const getTool = `query GetTool($id: ID!) {
  getTool(id: $id) {
    id
    userId
    name
    website
  }
}
`;
export const listTools = `query ListTools(
  $filter: ModelToolFilterInput
  $limit: Int
  $nextToken: String
) {
  listTools(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      website
    }
    nextToken
  }
}
`;
