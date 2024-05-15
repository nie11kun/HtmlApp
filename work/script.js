window.onload = function() {
    var choice = this.document.getElementById('typeSelect');
    choice.options.selectedIndex = 1;

    this.showForm();

};

function showForm() {
    var choice = this.document.getElementById('typeSelect');
    var arcForm = this.document.getElementById('arcCacu');
    var rotateForm = this.document.getElementById('rotateCacu');
    var linespeedForm = this.document.getElementById('lineSpeedCacu');
    var zhongForm = this.document.getElementById('zhongCacu');

    switch (choice.options.selectedIndex) {
        case 0:
            arcForm.classList.add('d-none');
            rotateForm.classList.add('d-none');
            linespeedForm.classList.add('d-none');
            zhongForm.classList.add('d-none');
            break;
        case 1:
            var coeffiecientChoice = this.document.getElementById('coeSelect');
            coeffiecientChoice.options.selectedIndex = 1;
            arcForm.classList.remove('d-none');
            rotateForm.classList.add('d-none');
            linespeedForm.classList.add('d-none');
            zhongForm.classList.add('d-none');
            break;
        case 2:
            arcForm.classList.add('d-none');
            rotateForm.classList.remove('d-none');
            linespeedForm.classList.add('d-none');
            zhongForm.classList.add('d-none');
            break;
        case 3:
            arcForm.classList.add('d-none');
            rotateForm.classList.add('d-none');
            linespeedForm.classList.remove('d-none');
            zhongForm.classList.add('d-none');
            break;
        case 4:
            arcForm.classList.add('d-none');
            rotateForm.classList.add('d-none');
            linespeedForm.classList.add('d-none');
            zhongForm.classList.remove('d-none');
            break;
        case 5:
            window.location.href="calcAB.html";
            break;
        default:
            break;
    }
}

function arcCaculate() {
    var coeffiecientChoice = this.document.getElementById('coeSelect');
    var coeValue;
    if (coeffiecientChoice.options.selectedIndex == 1) {
        coeValue = 1.11;
    } else {
        coeValue = 1.08;
    }

    var ballDia = this.document.getElementById('ballDiaArc');
    var touchAng = this.document.getElementById('touchAngArc');
    var arcRadius = this.document.getElementById('arcRadiusArc');
    var horiOffset = this.document.getElementById('horiOffsetArc');
    var verOffset = this.document.getElementById('verOffsetArc');

    if (ballDia.value > 0 && touchAng.value > 0 && touchAng.value < 90) {
        arcRadius.value = (coeValue * ballDia.value / 2).toFixed(3);
        horiOffset.value = ((arcRadius.value - ballDia.value / 2) * Math.sin(touchAng.value * Math.PI / 180)).toFixed(3);
        verOffset.value = ((arcRadius.value - ballDia.value / 2) * Math.cos(touchAng.value * Math.PI / 180)).toFixed(3);
    } else {
        alert("请检查钢球直径/接触角是否正确");
    }
}

function arcReCaculate() {
    var coeffiecientChoice = this.document.getElementById('coeSelect');
    var coeValue;
    if (coeffiecientChoice.options.selectedIndex == 1) {
        coeValue = 1.11;
    } else {
        coeValue = 1.08;
    }

    var ballDia = this.document.getElementById('ballDiaArc');
    var touchAng = this.document.getElementById('touchAngArc');
    var arcRadius = this.document.getElementById('arcRadiusArc');
    var horiOffset = this.document.getElementById('horiOffsetArc');
    var verOffset = this.document.getElementById('verOffsetArc');

    if (horiOffset.value > 0 && verOffset.value > 0 && arcRadius.value > 0) {
        ballDia.value = (arcRadius.value / coeValue * 2).toFixed(3);
        touchAng.value = (Math.asin(horiOffset.value / (arcRadius.value - ballDia.value / 2)) * (180 / Math.PI)).toFixed(3);

        if (!touchAng.value) {
            alert("接触角不存在，请检查圆弧半径/偏心是否正确");
        }
    } else {
        alert("请检查圆弧半径/偏心是否正确");
    }
}

function rotateAngCaculate() {
    var pinch = this.document.getElementById('pinchRotateAng');
    var dia = this.document.getElementById('diaRotateAng');
    var rotateAng = this.document.getElementById('rotateAngRotateAng');

    if (pinch.value > 0 && dia.value > 0) {
        rotateAng.value = (Math.atan(pinch.value / (Math.PI * dia.value)) * (180 / Math.PI)).toFixed(3);
    } else {
        alert("请检查螺距/中径是否正确");
    }
}

function lineSpeedCaculate() {
    var dia = this.document.getElementById('diaLinespeed');
    var linespeed = this.document.getElementById('linespeedLinespeed');
    var rotatespeed = this.document.getElementById('rotatespeedLinespeed');

    if (dia.value > 0 && rotatespeed.value > 0) {
        linespeed.value = (rotatespeed.value / 60 * (dia.value * Math.PI) / 1000).toFixed(3);
    } else {
        alert("请输入正确的直径和转速")
    }
}

function rotateSpeedCaculate() {
    var dia = this.document.getElementById('diaLinespeed');
    var linespeed = this.document.getElementById('linespeedLinespeed');
    var rotatespeed = this.document.getElementById('rotatespeedLinespeed');

    if (dia.value > 0 && linespeed.value > 0) {
        rotatespeed.value = (linespeed.value * 1000 / (dia.value * Math.PI) * 60).toFixed(3);
    } else {
        alert("请输入正确的直径和线速度")
    }
}

function zhongCaculate() {
    var workDia = this.document.getElementById('workDia');
    var workSanXian = this.document.getElementById('workSanXian');
    var workGangQiuDia = this.document.getElementById('workGangQiuDia');
    var workZhong = this.document.getElementById('workZhong');

    if (workDia.value > 0 && workSanXian.value > 0 && workGangQiuDia.value > 0) {
        workZhong.value = ((workDia.value - workSanXian.value) / 2 + workGangQiuDia.value);
    } else {
        alert("请检查参数是否正确");
    }
}
