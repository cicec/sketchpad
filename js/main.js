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
        brush: {
            id: 1,
            width: 2,
            color: '#36435E',
            btn: document.getElementById('brush'),
            changeWidth: (width) => { tools.brush.width = width },
            changeColor: (color) => { tools.brush.color = color },
        },
        eraser: {
            id: 2,
            width: 40,
            btn: document.getElementById('eraser')
        },
        clear: { btn: document.getElementById('clear') },
        download: { btn: document.getElementById('download') },
        palette: [
            { btn: document.getElementById('color1'), color: '#E4001F' },
            { btn: document.getElementById('color2'), color: '#FBCF00' },
            { btn: document.getElementById('color3'), color: '#00D09C' },
            { btn: document.getElementById('color4'), color: '#4389F2' },
            { btn: document.getElementById('color5'), color: '#6D00A2' },
            { btn: document.getElementById('color6'), color: '#36435E' },
        ],
        widthControl: [
            { btn: document.getElementById('width-small'), width: 2 },
            { btn: document.getElementById('width-medium'), width: 5 },
            { btn: document.getElementById('width-large'), width: 20 },
        ],
        uncheckBtn: (btn) => { btn.classList.remove('active') },
        checkBtn: (btn) => { btn.classList.add('active') }
    }

    let isPressing = false
    let selectedId = tools.brush.id
    let lastPoint = {}

    tools.brush.btn.onclick = () => {
        tools.uncheckBtn(tools.eraser.btn)
        tools.checkBtn(tools.brush.btn)
        selectedId = tools.brush.id
    }
    tools.eraser.btn.onclick = () => {
        tools.uncheckBtn(tools.brush.btn)
        tools.checkBtn(tools.eraser.btn)
        selectedId = tools.eraser.id
    }
    tools.clear.btn.onclick = () => { context.clearRect(0, 0, canvas.width, canvas.height) }
    tools.download.btn.onclick = () => {
        const base64Img = canvas.toDataURL()
        const oA = document.createElement('a')
        oA.href = base64Img
        oA.download = '我的作品.png'
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        oA.dispatchEvent(event)
    }

    tools.palette.forEach((item) => {
        item.btn.onclick = () => {
            tools.brush.changeColor(item.color)
        }
    })

    tools.widthControl.forEach((item) => {
        item.btn.onclick = () => {
            tools.brush.changeWidth(item.width)
        }
    })

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
                context.clearRect(x, y, 50, 50)
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
                context.clearRect(x, y, 50, 50)
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
            event.preventDefault()
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