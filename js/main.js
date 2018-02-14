const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const coverPage = () => {
    const pageWidth = document.documentElement.clientWidth
    const pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
}

const drawCircle = (x, y, radius) => {
    context.fillStyle = 'black'
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

const drawLine = (startPoint, endPoint, lineWidth) => {
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

    let isPressing = false
    let seleted = 'brush'
    let lastPoint = {}

    canvas.onmousedown = (event) => {
        const x = event.clientX
        const y = event.clientY
        switch (seleted) {
            case 'brush':
                isPressing = true
                lastPoint = { x, y }
                drawCircle(x, y, 10)
                break
            case 'eraser':
                break
            default:
                break
        }
    }

    canvas.onmousemove = (event) => {
        const x = event.clientX
        const y = event.clientY
        switch (seleted) {
            case 'brush':
                if (isPressing) {
                    drawCircle(x, y, 10)
                    drawLine(lastPoint, { x, y }, 20)
                    lastPoint = { x, y }
                }
                break
            case 'eraser':
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