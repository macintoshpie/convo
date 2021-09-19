const container = document.getElementById('main-container')
let shiftDown = false;
let currentBox = -1;
let numBoxes = 0
let helpStep = -1

const boxId = (boxIndex) => `box-${boxIndex}`

const setCurrentBox = (boxIndex) => {
  const oldBox = document.getElementById(boxId(currentBox))
  if (oldBox) {
    oldBox.classList.remove('active-box')
  }
  currentBox = boxIndex
  const newBox = document.getElementById(boxId(currentBox))
  newBox.classList.add('active-box')
}

const selectBox = (boxIndex) => {
  setCurrentBox(boxIndex)
  const box = document.getElementById(boxId(boxIndex))
  if (box.childNodes.length == 0) {
    box.focus()
  } else {
    const range = document.createRange()
    const sel = window.getSelection()
    const lastChild = box.childNodes[box.childNodes.length - 1]
    range.setStartAfter(lastChild)
    range.setEndAfter(lastChild)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    box.focus()
  }

  box.scrollIntoView({ block: 'nearest' })
}

const addBox = (text) => {
  numBoxes = numBoxes + 1
  let thisBoxIdx = numBoxes - 1
  // let currentBoxCopy = currentBox
  const box = document.createElement('p')
  box.id = boxId(thisBoxIdx)
  box.setAttribute('contenteditable', 'true')
  box.addEventListener('click', () => setCurrentBox(thisBoxIdx))
  box.classList.add('box')
  if (text) {
    box.innerText = text
  }
  container.appendChild(box)
  console.log(thisBoxIdx)
  // setTimeout(() => selectBox(currentBox), 1000)
  selectBox(thisBoxIdx)
}

addBox()

document.addEventListener('keydown', (e) => {
  if (e.keyCode == 9) {
    e.preventDefault()
  } else if (e.keyCode == 16) {
    shiftDown = true
  }
})

const goToNextBox = () => {
  if (currentBox + 1 < numBoxes) {
    selectBox(currentBox + 1)
  } else {
     addBox()
  }
}

const goToPreviousBox = () => {
  selectBox(Math.max(currentBox - 1, 0))
}

document.addEventListener('keyup', (e) => {
  if (e.keyCode == 9) {
    e.preventDefault()
    if (shiftDown) {
      goToPreviousBox()
    } else {
      goToNextBox()
    }
  } else if (e.keyCode == 16) {
    shiftDown = false
  }
})

const clearAll = () => {
  let boxes = document.querySelectorAll('.box')
  boxes = [...boxes]
  boxes.forEach(box => box.remove())
  currentBox = -1
  numBoxes = 0
}

const reset = () => {
  clearAll()
  helpStep = -1
  addBox()
}

const getText = () => {
  let boxes = document.querySelectorAll('.box')
  boxes = [...boxes].map(box => box.innerText)
  return boxes.join('\n------------\n')
}

const download = () => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(getText()));
  const currentDatetime = new Date().toLocaleString()
  const fileName = `convo_${currentDatetime}`.replaceAll('/', '-').replaceAll(' ', '_').replaceAll(',', '').replaceAll(':', '-')
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const helpMessages = [
  [
    `What is this thing?`,
    `This is a tool for having conversations with yourself. If you're ever feeling off or like you need\
 to talk to someone, this can be a helpful way to sort out why you're feeling that way.`,
    `How do I use it?`,
    `Imagine you're having a conversation with a friend. Start by writing how your feel or a question\
 then press the tab key to go to the next message box. Now role play as a friend trying to help out\
 the person who wrote the message in the box above and write your response.`,
    `That's pretty confusing.`,
    `Click the question mark icon again to see an example.`
  ],
  [
    `I feel like eating ice cream but I'm not sure if I should`,
    `Do you feel like you shouldn't eat ice cream or that you really don't want ice cream`,
    `Not sure, I am hungry but have been thinking about gelato a lot recently`,
    `If there was ice cream and gelato in front of you now, which would you choose?`,
    `I'd probably choose the gelato, I guess that's what I really want!`
  ]
]

const help = () => {
  if (helpStep == -1 && getText().length > 0) {
    if (!confirm('This will clear your current conversation. Is that ok?')) {
      return
    }
  }

  clearAll()

  if (helpStep == helpMessages.length - 1) {
    addBox(`That's all for the help. Press the trashcan icon to reset everything.

Keyboard controls:
tab: next box
shift + tab: previous box`)
    return
  }

  helpStep += 1
  helpMessages[helpStep].forEach(message => addBox(message))
  // set focus back to the first box
  selectBox(0)
}
