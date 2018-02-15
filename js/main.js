const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const createNode = (tag, attributes) => {
    const node = document.createElement(tag)
    Object.keys(attributes).forEach((key) => {
        node[key] = attributes[key]
    })
    return node
}

const coverPage = () => {
    const pageWidth = document.documentElement.clientWidth
    const pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
}

const drawCircle = (x, y, width, color) => {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, width / 2, 0, Math.PI * 2)
    context.fill()
}

const drawLine = (startPoint, endPoint, lineWidth, color) => {
    context.strokeStyle = color
    context.beginPath()
    context.moveTo(startPoint.x, startPoint.y)
    context.lineWidth = lineWidth
    context.lineTo(endPoint.x, endPoint.y)
    context.stroke()
    context.closePath()
}

const main = () => {
    coverPage()
    window.onresize = coverPage

    const tools = {
        brush: { id: 1, width: 5, color: '#000000' },
        eraser: { id: 2, width: 40 }
    }
    const canvasColor = '#ffffff'

    let isPressing = false
    let selectedId = tools.brush.id
    let lastPoint = {}

    const brush = document.getElementById('brush')
    const eraser = document.getElementById('eraser')
    const clear = document.getElementById('clear')

    brush.onclick = () => { selectedId = tools.brush.id }
    eraser.onclick = () => { selectedId = tools.eraser.id }
    clear.onclick = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const pressStart = (x, y) => {
        isPressing = true
        switch (selectedId) {
            case tools.brush.id: {
                lastPoint = { x, y }
                drawCircle(x, y, tools.brush.width, tools.brush.color)
                break
            }
            case tools.eraser.id: {
                lastPoint = { x, y }
                drawCircle(x, y, tools.eraser.width, canvasColor)
                break
            }
            default: break
        }
    }

    const pressMove = (x, y) => {
        if (!isPressing) return
        switch (selectedId) {
            case tools.brush.id: {
                drawCircle(x, y, tools.brush.width, tools.brush.color)
                drawLine(lastPoint, { x, y }, tools.brush.width, tools.brush.color)
                lastPoint = { x, y }
                break
            }
            case tools.eraser.id: {
                drawCircle(x, y, tools.eraser.width, canvasColor)
                drawLine(lastPoint, { x, y }, tools.eraser.width, canvasColor)
                lastPoint = { x, y }
                break
            }
            default: break
        }
    }

    const pressEnd = () => { isPressing = false }

    if ('ontouchstart' in document.body) {
        canvas.ontouchstart = (event) => {
            const x = event.touches[0].clientX
            const y = event.touches[0].clientY
            pressStart(x, y)
        }

        canvas.ontouchmove = (event) => {
            const x = event.touches[0].clientX
            const y = event.touches[0].clientY
            pressMove(x, y)
        }

        canvas.ontouchend = () => {
            pressEnd()
        }
    } else {
        canvas.onmousedown = (event) => {
            const x = event.clientX
            const y = event.clientY
            pressStart(x, y)
        }

        canvas.onmousemove = (event) => {
            const x = event.clientX
            const y = event.clientY
            pressMove(x, y)
        }

        canvas.onmouseup = () => {
            pressEnd()
        }
    }
}

window.onload = main