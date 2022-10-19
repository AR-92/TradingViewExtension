var i = document.getElementsByClassName("tv-feed-pagination__page js-page-reference").length - 1;
var last = document.getElementsByClassName("tv-feed-pagination__page js-page-reference")[i].innerHTML;
var global = {
    long: 0,
    short: 0,
    llong: 0,
    lshort: 0,
}
var loadButton = `
<div class="js-offer-button btn">
<span class="tv-header__offer-button-container tv-header__offer-button-container--trial">
<a class="tv-header__offer-button" id="getdata">
<span class="tv-header__offer-button-title">Load</span>
<small>${last} Pages</small>
</a>
</span>
</div>
`;

var analizeButton = `
<div class="js-offer-button btn">
<span class="tv-header__offer-button-container tv-header__offer-button-container--trial">
<a class="tv-header__offer-button" id="analyse" style="background-color: #2ac527;">
<span class="tv-header__offer-button-title">Analyse</span>
<small>Extension</small>
</a>
</span>
</div>
`;



document.getElementsByClassName("tv-card-container__column-row")[0].insertAdjacentHTML("beforeend", loadButton);
document.getElementsByClassName("tv-card-container__column-row")[0].insertAdjacentHTML("beforeend", analizeButton);

document.getElementById("getdata").addEventListener("click", getdata);
document.getElementById("analyse").addEventListener("click", analyseData);

function ifSignal(v) {
    if (v == "LONG" || v == "SHORT") {
        return true
    } else {
        return false
    }
}

function getAllIdeas() {
    var r = document.getElementById("rsult");
    if (r) {
        r.remove()
    }

    var ideas = document.getElementsByClassName("tv-widget-idea");
    var arraydata = []
    for (let a = 0; a < ideas.length; a++) {
        if (ideas[a].innerText && ideas[a].children[0].children[0]) {
            var s = ideas[a].innerText;
            s = s.split("\n");
            s.push(ideas[a].children[0].children[0].href)
            s = s.filter(n => {
                if (n !== " " && n !== ", " && n !== ", ") {
                    return n;
                }
            })
            if (ifSignal(s[3])) {
                arraydata.push(s);
            }
        }
    }
    return arraydata;
};

function getdata() {
    var interval = setInterval(() => {
        if (document.getElementsByClassName("tv-load-more__btn tv-load-more__btn--sticky js-load-more tv-button--loader")[0]) {
            document.getElementsByClassName("tv-load-more__btn tv-load-more__btn--sticky js-load-more tv-button--loader")[0].click();
        } else {
            window.scrollTo(0, document.body.scrollHeight);
        }
        var url = window.location.href;
        var loader = document.getElementsByClassName("tv-button__loader")[0];
        if (url.includes("page-" + last) && !loader) {
            clearInterval(interval);
        }
    }, 2000);
};

function percentage(par, total) {
    var per = 0
    if (total != 0) {
        per = (par / total) * 100
    }
    return per
}

function sheet(v) {
    global = {
        long: 0,
        short: 0,
        llong: 0,
        lshort: 0,
    }
    var t = []
    for (const p in v) {
        t.push({
            name: p,
            count: v[p].count,
            lcount: v[p].Slikes + v[p].Llikes,
            long: v[p].LONG,
            longPer: percentage(v[p].LONG, v[p].count),
            llong: percentage(v[p].Llikes, v[p].Llikes + v[p].Slikes),
            short: v[p].SHORT,
            shortPer: percentage(v[p].SHORT, v[p].count),
            lshort: percentage(v[p].Slikes, v[p].Llikes + v[p].Slikes),
            ct: v[p].ct
        })
        global.long += v[p].LONG
        global.short += v[p].SHORT
        global.llong += v[p].Llikes
        global.lshort += v[p].Slikes
    }
    t = t.sort((a, b) => {
            return b["count"] - a["count"]
        })
    genList(t)
}

function genList(v) {
    var statsHTML = `
    <style>
    progress::-webkit-progress-bar {background-color: #131722; width: 100%;}
    progress {background-color: #131722;border: solid;color: green;
        border-color: #131722;
        border-radius: 10px;}
    progress::-webkit-progress-value {background-color: green !important;border: solid;
        border-color:  #131722;border-width: 2.5px;
        border-radius: 10px;}
    .cardRecord a:hover {
        background: #454956 !important;
    }
    </style>

    <div id="rsult" style="
    min-width: 105%;
    padding:20px">
    <ul style="display:inline;">
    `;
    var h = ``;
    for (let i = 0; i < v.length; i++) {
        h += `
        <li class="cardRecord" 
        style=" display: inline;
        list-style-type: none;">
        <a href="https://www.tradingview.com/symbols/${v[i]["name"]}/ideas/" target="blank" class="tv-header__offer-button"
        style="
        padding: 5px;
        margin: 5px;
        cursor: pointer;
        height: fit-content;
        white-space: nowrap;
        background:#232732;
        border-radius: 10px;">
        <small style="font-size: smaller;">
        <table style="text-align: initial;"> 
        <tr style="white-space: nowrap;"><b>💡${v[i]["count"]}:❤️${v[i]["lcount"]}|💰${v[i]["name"]}|🟢:${v[i]["long"]}|🔴:${v[i]["short"]} </b></tr>
        <tr style="white-space: nowrap;"><td>🧮</td><td>💡</td><td>${parseInt(percentage(v[i]["count"],global.long + global.short))}%</td><td> <progress max="100" value="${parseInt(percentage(v[i]["count"],global.long + global.short))}"></progress></td><td></td><td></td></tr>
        <tr style="white-space: nowrap;"><td>🧮</td><td>❤️</td><td>${parseInt(percentage(v[i]["lcount"],global.llong + global.lshort))}%</td><td> <progress max="100" value="${parseInt(percentage(v[i]["lcount"],global.llong + global.lshort))}"></progress></td><td></td><td></td></tr>
        <tr style="white-space: nowrap;"><td>💰💡</td><td>🟢</td><td>${parseInt(v[i]["longPer"])}%</td><td> <progress   max="100" value="${parseInt(v[i]["longPer"])}"></progress></td> <td>🔴</td><td>${parseInt(v[i]["shortPer"])}%</td></tr>
        <tr style="white-space: nowrap;"><td>💰❤️</td><td>🟢</td><td>${parseInt(v[i]["llong"])}%</td><td> <progress   max="100" value="${parseInt(v[i]["llong"])}"></progress></td> <td>🔴</td><td>${parseInt(v[i]["lshort"])}%</td></tr>
        `;
        for (const item in v[i]["ct"]) {
            h += `
            <tr style="white-space: nowrap;">
            <td>🕔${item}💡${v[i]["ct"][item]["L"]+v[i]["ct"][item]["S"]}</td>
            <td>🟢</td><td>${v[i]["ct"][item]["L"]}❤️${v[i]["ct"][item]["LL"]}</td> 
            <td ><progress  max="${v[i]["ct"][item]["L"] + v[i]["ct"][item]["S"]}" value="${v[i]["ct"][item]["L"]}"></progress></td>
            <td>🔴</td><td>${v[i]["ct"][item]["S"]}❤️${v[i]["ct"][item]["SL"]}</td>
            </tr>
            `;
        }
        h += "</table></small></a></li>";
    }
    h += "</ul></div>";
    statsHTML += h;
    document.getElementsByClassName("tv-card-container__column-row")[0].insertAdjacentHTML("afterend", statsHTML);

}

function analyseData() {
    var dataarray = getAllIdeas();
    var obj = {};
    dataarray.forEach(e => {
        if (obj[e[1]] == undefined) {
            obj[e[1]] = {
                count: 0,
                LONG: 0,
                SHORT: 0,
                Llikes: 0,
                Slikes: 0,
                ct: {}
            }
            obj[e[1]]["count"] = 1;
            if (!obj[e[1]]["ct"][e[2]]) { obj[e[1]]["ct"][e[2]] = {C:0,L:0,S:0,LL:0,SL:0} }
            obj[e[1]]["ct"][e[2]]["C"]+=1
            if (e[3] == "LONG") {
                obj[e[1]]["ct"][e[2]]["L"]+=1
                obj[e[1]]["ct"][e[2]]["LL"]+=parseInt(e[e.length - 3])
                obj[e[1]]["LONG"] = 1
                obj[e[1]]["Llikes"] += parseInt(e[e.length - 3])
            } else {
                obj[e[1]]["ct"][e[2]]["S"]+=1
                obj[e[1]]["ct"][e[2]]["SL"]+=parseInt(e[e.length - 3])
                obj[e[1]]["SHORT"] = 1
                obj[e[1]]["Slikes"] += parseInt(e[e.length - 3])
            }
        } else {
            obj[e[1]]["count"] += 1;
            if (!obj[e[1]]["ct"][e[2]]) { obj[e[1]]["ct"][e[2]] = {C:0,L:0,S:0,LL:0,SL:0} }
            obj[e[1]]["ct"][e[2]]["C"]+=1
            if (e[3] == "LONG") {
                obj[e[1]]["ct"][e[2]]["L"]+=1
                obj[e[1]]["ct"][e[2]]["LL"]+=parseInt(e[e.length - 3])
                obj[e[1]]["LONG"] += 1
                obj[e[1]]["Llikes"] += parseInt(e[e.length - 3])
            } else {
                obj[e[1]]["ct"][e[2]]["S"]+=1
                obj[e[1]]["ct"][e[2]]["SL"]+=parseInt(e[e.length - 3])
                obj[e[1]]["SHORT"] += 1
                obj[e[1]]["Slikes"] += parseInt(e[e.length - 3])
            }
        }
    });
    console.log(obj);
    sheet(obj)
};