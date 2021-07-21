const container = document.getElementById('main-container')
let shiftDown = false;
let currentBox = -1;
let numBoxes = 0

const boxId = (boxIndex) => `box-${boxIndex}`

const selectBox = (boxIndex) => {
  currentBox = boxIndex
  const box = document.getElementById(boxId(boxIndex))
  if (box.childNodes.length == 0) {
    box.focus()
    return
  }
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

const addBox = () => {
  numBoxes = numBoxes + 1
  currentBox = numBoxes - 1
  let currentBoxCopy = currentBox
  const box = document.createElement('p')
  box.id = boxId(currentBox)
  box.setAttribute('contenteditable', 'true')
  box.addEventListener('click', () => {currentBox = currentBoxCopy})
  box.classList.add('box')
  container.appendChild(box)
  selectBox(currentBox)
}

addBox()

document.addEventListener('keydown', (e) => {
  if (e.keyCode == 9) {
    e.preventDefault()
  } else if (e.keyCode == 16) {
    shiftDown = true
  }
})

document.addEventListener('keyup', (e) => {
  if (e.keyCode == 9) {
    e.preventDefault()
    if (shiftDown) {
      selectBox(Math.max(currentBox - 1, 0))
    } else {
      if (currentBox + 1 < numBoxes) {
        selectBox(currentBox + 1)
      } else {
         addBox()
      }
    }
    
  } else if (e.keyCode == 16) {
    shiftDown = false
  }
})

const reset = () => {
  let boxes = document.querySelectorAll('.box')
  boxes = [...boxes]
  boxes.forEach(box => box.remove())
  currentBox = -1
  numBoxes = 0
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
