const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

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
        brush: { id: 1, width: 20, color: '#000000' },
        eraser: { id: 2, width: 20 }
    }

    let isPressing = false
    let selectedId = tools.brush.id
    let lastPoint = {}

    const brush = document.getElementById('brush')
    const eraser = document.getElementById('eraser')

    brush.onclick = () => { selectedId = tools.brush.id }
    eraser.onclick = () => { selectedId = tools.eraser.id }

    canvas.onmousedown = (event) => {
        const x = event.clientX
        const y = event.clientY
        isPressing = true
        switch (selectedId) {
            case tools.brush.id:
                lastPoint = { x, y }
                drawCircle(x, y, tools.brush.width, tools.brush.color)
                break
            case tools.eraser.id:
                context.clearRect(x, y, tools.eraser.width, tools.eraser.width)
                break
            default:
                break
        }
    }

    canvas.onmousemove = (event) => {
        if (!isPressing) return
        const x = event.clientX
        const y = event.clientY
        switch (selectedId) {
            case tools.brush.id:
                drawCircle(x, y, tools.brush.width, tools.brush.color)
                drawLine(lastPoint, { x, y }, tools.brush.width, tools.brush.color)
                lastPoint = { x, y }
                break
            case tools.eraser.id:
                context.clearRect(x, y, tools.eraser.width, tools.eraser.width)
                break
            default:
                break
        }
    }

    canvas.onmouseup = () => {
        isPressing = false
    }
}

window.onload = main