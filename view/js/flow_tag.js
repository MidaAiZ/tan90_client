var tagParams = {
    radius: 110,
    d: 200,
    dtr: Math.PI / 180,
    mcList: [],
    lasta: 1,
    lastb: 1,
    distr: true,
    tspeed: 11,
    size: 200,
    mouseX: 0,
    mouseY: 10,
    howElliptical: 1,
    aA: null,
    oDiv: null
}
// window.onload = function()
function setupTag() {
    var i = 0;
    var oTag = null;
    tagParams.oDiv = document.getElementById('flow_tag_widget');
    tagParams.aA = tagParams.oDiv.getElementsByClassName('item');
    for (var i = 0; i < tagParams.aA.length; i++) {
        oTag = {};
        tagParams.aA[i].onmouseover = (function(obj) {
            return function() {
                obj.on = true;
                this.style.zIndex = 9999;
                this.style.color = '#fff';
                this.style.background = '#0099ff';
                this.style.padding = '5px 5px';
                this.style.filter = "alpha(opacity=100)";
                this.style.opacity = 1;
            }
        })(oTag)
        tagParams.aA[i].onmouseout = (function(obj) {
            return function() {
                obj.on = false;
                this.style.zIndex = obj.zIndex;
                this.style.color = '#fff';
                this.style.background = '#30899B';
                this.style.padding = '5px';
                this.style.filter = "alpha(opacity=" + 100 * obj.alpha + ")";
                this.style.opacity = obj.alpha;
                this.style.zIndex = obj.zIndex;
            }
        })(oTag)
        oTag.offsetWidth = tagParams.aA[i].offsetWidth;
        oTag.offsetHeight = tagParams.aA[i].offsetHeight;
        tagParams.mcList.push(oTag);
    }
    sineCosine(0, 0, 0);
    positionAll();
    (function() {
        update();
        setTimeout(arguments.callee, 40);
    })();
};

function update() {
    var a, b, c = 0;
    a = (Math.min(Math.max(-tagParams.mouseY, -tagParams.size), tagParams.size) / tagParams.radius) * tagParams.tspeed;
    b = (-Math.min(Math.max(-tagParams.mouseX, -tagParams.size), tagParams.size) / tagParams.radius) * tagParams.tspeed;
    tagParams.lasta = a;
    tagParams.lastb = b;
    if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
        return;
    }
    sineCosine(a, b, c);
    for (var i = 0; i < tagParams.mcList.length; i++) {
        if (tagParams.mcList[i].on) {
            continue;
        }
        var rx1 = tagParams.mcList[i].cx;
        var ry1 = tagParams.mcList[i].cy * ca + tagParams.mcList[i].cz * (-sa);
        var rz1 = tagParams.mcList[i].cy * sa + tagParams.mcList[i].cz * ca;

        var rx2 = rx1 * cb + rz1 * sb;
        var ry2 = ry1;
        var rz2 = rx1 * (-sb) + rz1 * cb;

        var rx3 = rx2 * cc + ry2 * (-sc);
        var ry3 = rx2 * sc + ry2 * cc;
        var rz3 = rz2;

        tagParams.mcList[i].cx = rx3;
        tagParams.mcList[i].cy = ry3;
        tagParams.mcList[i].cz = rz3;

        per = tagParams.d / (tagParams.d + rz3);

        tagParams.mcList[i].x = (tagParams.howElliptical * rx3 * per) - (tagParams.howElliptical * 2);
        tagParams.mcList[i].y = ry3 * per;
        tagParams.mcList[i].scale = per;
        var alpha = per;
        alpha = (alpha - 0.6) * (10 / 6);
        tagParams.mcList[i].alpha = alpha * alpha * alpha - 0.2;
        tagParams.mcList[i].zIndex = Math.ceil(100 - Math.floor(tagParams.mcList[i].cz));
    }
    doPosition();
}

function depthSort() {
    var i = 0;
    var aTmp = [];
    for (var i = 0; i < tagParams.aA.length; i++) {
        aTmp.push(tagParams.aA[i]);
    }
    aTmp.sort(
        function(vItem1, vItem2) {
            if (vItem1.cz > vItem2.cz) {
                return -1;
            } else if (vItem1.cz < vItem2.cz) {
                return 1;
            } else {
                return 0;
            }
        }
    );
    for (var i = 0; i < aTmp.length; i++) {
        aTmp[i].style.zIndex = i;
    }
}

function positionAll() {
    var phi = 0;
    var theta = 0;
    var max = tagParams.mcList.length;
    for (var i = 0; i < max; i++) {
        if (tagParams.distr) {
            phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
            theta = Math.sqrt(max * Math.PI) * phi;
        } else {
            phi = Math.random() * (Math.PI);
            theta = Math.random() * (2 * Math.PI);
        }
        //坐标变换
        tagParams.mcList[i].cx = tagParams.radius * Math.cos(theta) * Math.sin(phi);
        tagParams.mcList[i].cy = tagParams.radius * Math.sin(theta) * Math.sin(phi);
        tagParams.mcList[i].cz = tagParams.radius * Math.cos(phi);
        tagParams.aA[i].style.left = tagParams.mcList[i].cx + tagParams.oDiv.offsetWidth / 2 - tagParams.mcList[i].offsetWidth / 2 + 'px';
        tagParams.aA[i].style.top = tagParams.mcList[i].cy + tagParams.oDiv.offsetHeight / 2 - tagParams.mcList[i].offsetHeight / 2 + 'px';
    }
}

function doPosition() {
    var l = tagParams.oDiv.offsetWidth / 2;
    var t = tagParams.oDiv.offsetHeight / 2;
    for (var i = 0; i < tagParams.mcList.length; i++) {
        if (tagParams.mcList[i].on) {
            continue;
        }
        var aAs = tagParams.aA[i].style;
        if (tagParams.mcList[i].alpha > 0.1) {
            if (aAs.display != '')
                aAs.display = '';
        } else {
            if (aAs.display != 'none')
                aAs.display = 'none';
            continue;
        }
        aAs.left = tagParams.mcList[i].cx + l - tagParams.mcList[i].offsetWidth / 2 + 'px';
        aAs.top = tagParams.mcList[i].cy + t - tagParams.mcList[i].offsetHeight / 2 + 'px';
        //aAs.fontSize=Math.ceil(12*tagParams.mcList[i].scale/2)+8+'px';
        //aAs.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+100*tagParams.mcList[i].alpha+")";
        aAs.filter = "alpha(opacity=" + 100 * tagParams.mcList[i].alpha + ")";
        aAs.zIndex = tagParams.mcList[i].zIndex;
        aAs.opacity = tagParams.mcList[i].alpha;
    }
}

function sineCosine(a, b, c) {
    sa = Math.sin(a * tagParams.dtr);
    ca = Math.cos(a * tagParams.dtr);
    sb = Math.sin(b * tagParams.dtr);
    cb = Math.cos(b * tagParams.dtr);
    sc = Math.sin(c * tagParams.dtr);
    cc = Math.cos(c * tagParams.dtr);
}
