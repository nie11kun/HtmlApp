window.onload = function () {
    var choice = this.document.getElementById('typeSelect');
    var arcForm = this.document.getElementById('arcCacu');
    var rotateForm = this.document.getElementById('rotateCacu');

    choice.options.selectedIndex = 1;

    this.showForm();

}

function showForm() {
    var choice = this.document.getElementById('typeSelect');
    var arcForm = this.document.getElementById('arcCacu');
    var rotateForm = this.document.getElementById('rotateCacu');

    if (choice.options.selectedIndex == 0) {
        arcForm.classList.add('d-none');
        rotateForm.classList.add('d-none');
    } else {
        if (choice.options.selectedIndex == 1) {
            arcForm.classList.remove('d-none');
            rotateForm.classList.add('d-none');
        } else {
            arcForm.classList.add('d-none');
            rotateForm.classList.remove('d-none');
        }
    }
}

function arcCaculate() {
    var ballDia = this.document.getElementById('ballDia');
    var touchAng = this.document.getElementById('touchAng');
    var arcRadius = this.document.getElementById('arcRadius');
    var horiOffset = this.document.getElementById('horiOffset');
    var verOffset = this.document.getElementById('verOffset');

    if (ballDia.value > 0 && 0 < touchAng.value < 90) {
        arcRadius.value = (1.11 * ballDia.value / 2).toFixed(3);
        horiOffset.value = ((arcRadius.value - ballDia.value / 2) * Math.sin(touchAng.value * Math.PI / 180)).toFixed(3);
        verOffset.value = ((arcRadius.value - ballDia.value / 2) * Math.cos(touchAng.value * Math.PI / 180)).toFixed(3);
    } else {
        alert("请检查输入参数是否正确");
    }
}

function arcReCaculate() {
    var ballDia = this.document.getElementById('ballDia');
    var touchAng = this.document.getElementById('touchAng');
    var arcRadius = this.document.getElementById('arcRadius');
    var horiOffset = this.document.getElementById('horiOffset');
    var verOffset = this.document.getElementById('verOffset');

    if (horiOffset.value > 0 && verOffset.value > 0  && arcRadius.value > 0) {
        ballDia.value = arcRadius.value /1.11 * 2;
        touchAng.value = (Math.asin(horiOffset.value / (arcRadius.value - ballDia.value / 2)) * (180 / Math.PI)).toFixed(3);
    } else {
        alert("请检查输入参数是否正确");
    }
}

function rotateAngCaculate() {
    var pinch = this.document.getElementById('pinch');
    var dia = this.document.getElementById('dia');
    var rotateAng = this.document.getElementById('rotateAng');

    if (pinch.value > 0 && dia.value > 0) {
        rotateAng.value = (Math.atan(pinch.value / (Math.PI * dia.value)) * (180 / Math.PI)).toFixed(3);
    } else {
        alert("请检查输入参数是否正确");
    }
}