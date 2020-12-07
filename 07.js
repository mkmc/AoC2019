const INPUT = require('./readInput')('07.input')

const parentMap = {}
const childMap = {}

INPUT.forEach(rule => {
  const node = parseRule(rule)
  node.children.forEach(c => {
    if (!parentMap[c.color]) {
      parentMap[c.color] = []
    }
    parentMap[c.color].push(node.color)
  })
  childMap[node.color] = node.children
})

console.log('Part 1:', traverseUp('shiny gold').size)
console.log('Part 2:', traverseDown('shiny gold') - 1)

function parseRule(rule) {
  const [color, containing] = rule.split(' bags contain ')

  if (containing === 'no other bags.') {
    return { color, children: [] }
  } else {
    let children = []

    const components = containing.split(', ')
    components.forEach(component => {
      const countColorString = component.split(' bag')[0]
      children.push({
        count: parseInt(countColorString[0]),
        color: countColorString.substr(2),
      })
    })

    return { color, children }
  }
}

function traverseUp(color) {
  let bags = new Set()

  if (!parentMap[color]) {
    return bags
  }

  parentMap[color].forEach(node => {
    bags.add(node)
    ;[...traverseUp(node)].forEach(bags.add, bags)
  })

  return bags
}

function traverseDown(color) {
  let sum = 1

  if (!childMap[color]) {
    return sum
  }

  childMap[color].forEach(child => {
    sum += child.count * traverseDown(child.color)
  })

  return sum
}
