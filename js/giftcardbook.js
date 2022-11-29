var dataList = new Array();
var today = new Date();
var year = today.getFullYear();
var month = getMonthStr(today.getMonth() + 1);

var keyList = new Array();
var titleList = new Array('날짜', '카드', '판매처', '충전처', '종류');
var cashKeyList = new Array('원가', '단가', '수량');

$(function() {
    setKeyList();
    init();
    loadDataList();
});

function setKeyList() {
    var totalKeyList = new Array(titleList, cashKeyList);
    for (var totalKey of totalKeyList) {
        for (var key of totalKey) {
            keyList.push(key);
        }
    }
}

function init() {
    $(window).resize(setHeight);
    initYearSelect();
    initMonthSelect();
    clickPrevMonthBtn();
    clickThisMonthBtn();
    clickNextMonthBtn();
    changeYear();
    changeMonth();
    setHeight();
}

function loadDataList() {
    $.ajax({
        type : "GET",
        url : "https://script.google.com/macros/s/AKfycbyasILwI4kZaMx29L_WmsYT0c8sBcYdDNrourJvTsWbTwJ6MqvijA1SitK4zX4ZWcXn/exec",
        data : {
            "cmd" : "get"
        },
        success : function(rows) {
            setDataList(rows);
            setAccountBook();
        },
        error : function() {
            loadDataList();
        }
    });
}

function setDataList(rows) {
    for (var row of rows) {
        var data = new Array();
        for (var i = 0; i < keyList.length; i++) {
            var value = row[keyList[i]];
            if (cashKeyList.includes(keyList[i])) {
                value = value.replaceAll(",", "") * 1;
            }
            data.push(value);
        }
        dataList.push(data);
    }
}

function initYearSelect() {
    for (var i = 2022; i <= year; i++) {
        $("#yearSelect").append("<option value=" + i + ">" + i + "</option>");
    }
    $("#yearSelect").val(year);
}

function initMonthSelect() {
    for (var i = 1; i <= 12; i++) {
        $("#monthSelect").append("<option value=" + getMonthStr(i) + ">" + getMonthStr(i) + "</option>");
    }
    $("#monthSelect").val(month);
}

function clickPrevMonthBtn() {
    $("#prevMonthBtn").click(function() {
        if (month == "01") {
            year = (year * 1 - 1) + "";
            month = "12";
        } else {
            month = getMonthStr(month * 1 - 1);
        }
        setYearMonth();
        setAccountBook();
    });
}

function clickThisMonthBtn() {
    $("#thisMonthBtn").click(function() {
        year = today.getFullYear();
        month = getMonthStr(today.getMonth() + 1);
        setYearMonth();
        setAccountBook();
    });
}

function clickNextMonthBtn() {
    $("#nextMonthBtn").click(function() {
        if (month == "12") {
            year = (year * 1 + 1) + "";
            month = "01";
        } else {
            month = getMonthStr(month * 1 + 1);
        }
        setYearMonth();
        setAccountBook();
    });
}

function changeYear() {
    $("#yearSelect").change(function() {
        year = this.value;
        setAccountBook();
    });
}

function changeMonth() {
    $("#monthSelect").change(function() {
        month = this.value;
        setAccountBook();
    });
}

function setYearMonth() {
    $("#yearSelect").val(year);
    $("#monthSelect").val(month);
}

function setAccountBook() {
	setAccountBook11();
	setAccountBook12();
	setAccountBook13();
	setAccountBook2();
}

function setAccountBook11() {
	var titleArray = new Array('구분', '상품권', '거래가', '마진');
    var cardArray = new Array('텔로', '딥에코', '욜로', '딥온', '주거래', '4tune', '쿠키', '쿠키런', '람다람', '총몇명', '야코', '스무살', '010pay');
    var valueArray = new Array();
    for (var card of cardArray) {
        var gift = 0;
        var c = 0;
        var d = 0;
        for (var data of dataList) {
            if (!isThisMonth(data))
                continue;
            if (card != data[1])
                continue;
            gift += (data[5] * data[7]);
            c += (data[6] * data[7]);
            d += (data[5] * 0.92) * data[7];
        }
        valueArray.push(new Array(card, gift, c, d - c));
    }
    setAccountDiv1("#book11", '[ 카드 ]', titleArray, valueArray);
}

function setAccountBook12() {
	var titleArray = new Array('구분', '해피머니', '북앤라이프', '컬쳐랜드');
    var chargeArray = new Array('팔라고', '페이코', '모바일팝', '포인트로페이', '하나머니');
    var valueArray = new Array();
    for (var charge of chargeArray) {
        var happy = 0;
        var booknlife = 0;
        var culture = 0;
        for (var data of dataList) {
            if (!isThisMonth(data))
                continue;
            if (charge != data[3])
                continue;
            if (data[4] == titleArray[1]) {
                happy += (data[5] * data[7]);
            } else if (data[4] == titleArray[2]) {
                booknlife += (data[5] * data[7]);
            } else if (data[4] == titleArray[3]) {
                culture += (data[5] * data[7]);
	    }
        }
        valueArray.push(new Array(charge, happy, booknlife, culture));
    }
    setAccountDiv1("#book12", '[ 충전처 ]', titleArray, valueArray);
}

function setAccountBook13() {
    var titleArray = new Array('구분', '해피(월)', '북앤(월)', '컬쳐(월)');
    var chargeArray = new Array('팔라고', '페이코', '모바일팝', '포인트로페이', '하나머니');
    var valueArray = new Array(
		new Array(chargeArray[0], 2000000, 2000000, '불가'),
		new Array(chargeArray[1], 2000000, 2000000, 500000),
		new Array(chargeArray[2], 1500000, 3000000, '불가'),
	    	new Array(chargeArray[3], '불가', 5000000, '2000000'),
		new Array(chargeArray[4], '불가', 2000000, '불가')
    );
    setAccountDiv1("#book13", '[ 충전한도 ]', titleArray, valueArray);
}

function setAccountBook2() {
    var valueArray = new Array();
    for (var data of dataList) {
        if (!isThisMonth(data))
            continue;
		valueArray.push(data);
    }
    setAccountDiv2("#gbn0", '[ 상품권 ]', valueArray);
}

function setAccountDiv1(divId, header, titleArray, valueArray) {
    setAccountDiv(divId, header);
    setTable(divId, titleArray, valueArray);
}

function setAccountDiv2(divId, title, valueArray) {
    setAccountDiv(divId, title);
    setBookTable(divId, valueArray);
}

function setAccountDiv(divId, title) {
    $(divId).empty();
    setHeader(divId, title);
}

function setHeader(divId, text) {
    $(divId).append(
        $('<table/>').append(
            $('<tr/>', { height : '30', valign : 'bottom' }).append(
                $('<td/>', { class : 'accountHeader' }).append(
                    $('<font/>', { text : text } )
                )
            )
        )
    );
}

function setTable(divId, titleArray, valueArray) {
    var table = getTable();
    setTitle(table, titleArray);
    setContents(table, valueArray);
	$(divId).append(table);
}

function setBookTable(divId, valueArray) {
    var table = getTable();
    setBookTitle(table);
    setBookContents(table, valueArray);
    $(divId).append(table);
}

function setTitle(table, titleArray) {
    var tr = ($('<tr/>'));
    for (var title of titleArray) {
        tr.append($('<th/>', { align : 'center', width : '25%' }).append($('<font/>', { text : title } )));
    }
    table.append(tr);
}

function setContents(table, valueArray) {
    for (var value of valueArray) {
        var tr = ($('<tr/>'));
        for (var i = 0; i < value.length; i++) {
            var td = (i == 0) ? '<th/>' : '<td/>';
            var align = (i == 0) ? 'center' : 'right';
            var text = (i == 0) ? value[i] : getCommaValue(value[i]);
            var color = (i == 0) ? '' : getColor(value[i]);
            tr.append($(td, { align : align }).append($('<font/>', { text : text, color : color } )));
        }
        table.append(tr);
    }
}

function setBookTitle(table) {
    table.append($('<tr/>')
		.append($('<th/>', { align : 'center', 'width' : '16%' }).append($('<font/>', { text : '날짜' } )))
		.append($('<th/>', { align : 'center', 'width' : '12%' }).append($('<font/>', { text : '카드' } )))
        .append($('<th/>', { align : 'center', 'width' : '12%' }).append($('<font/>', { text : '판매처' } )))
        .append($('<th/>', { align : 'center', 'width' : '14%' }).append($('<font/>', { text : '충전처' } )))
        .append($('<th/>', { align : 'center', 'width' : '12%' }).append($('<font/>', { text : '종류' } )))
        .append($('<th/>', { align : 'center', 'width' : '12%' }).append($('<font/>', { text : '원가' } )))
        .append($('<th/>', { align : 'center', 'width' : '12%' }).append($('<font/>', { text : '단가' } )))
        .append($('<th/>', { align : 'center', 'width' : '10%' }).append($('<font/>', { text : '수량' } )))
	);
}

function setBookContents(table, valueArray) {
    for (var value of valueArray) {
        table.append($('<tr/>')
            .append($('<td/>', { align : 'center' }).append($('<font/>', { text : new Date(value[0]).format("yyyy-MM-dd (E)"), class : getDayClass(new Date(value[0]).format("E")) } )))
            .append($('<td/>', { align : 'center' }).append($('<font/>', { text : value[1] } )))
            .append($('<td/>', { align : 'center' }).append($('<font/>', { text : value[2] } )))
            .append($('<td/>', { align : 'center' }).append($('<font/>', { text : value[3] } )))
            .append($('<td/>', { align : 'center' }).append($('<font/>', { text : value[4] } )))
            .append($('<td/>', { align :  'right' }).append($('<font/>', { text : getCommaValue(value[5]) } )))
            .append($('<td/>', { align :  'right' }).append($('<font/>', { text : getCommaValue(value[6]) } )))
            .append($('<td/>', { align :  'right' }).append($('<font/>', { text : getCommaValue(value[7]) } )))
        );
    }
}

function getTable() {
    return $('<table/>', { class : 'table table-bordered table-striped' });
}

function isThisMonth(data) {
    if (data[0] == "" || !data[0].startsWith(getThisDate()))
        return false;
    return true;
}

function getDate(data) {
    var date = data[0];
    if (date == "")
        return "";
    return date.slice(0, 4) + "-" + date.slice(5, 7);
}

function getThisDate() {
    return year + "-" + month;
}

function getPrevDate() {
    if (month == "01") {
        return (year * 1 - 1) + "-12";
    }
    return year + "-" + getMonthStr(month * 1 - 1);
}

function getPrevPrevDate() {
    if (month == "01") {
        return (year * 1 - 1) + "-11";
    } else if (month == "02") {
        return (year * 1 - 1) + "-12";
    }
    return year + "-" + getMonthStr(month * 1 - 2);
}

function getMonthStr(month) {
    if (month < 10)
        return "0" + month;
    return month;
}

function getDateNum(date) {
    if (date == "")
        return 0;
    return date.replaceAll("-", "") * 1;
}

function getPrevDateNum(date) {
    if (date == "")
        return "";
    var y = date.slice(0, 4);
    var m = date.slice(5, 7);
    if (m == "01") {
        return ((y * 1 - 1) + "12") * 1;
    }
    return (y + getMonthStr(m * 1 - 1)) * 1;
}

function getColor(value) {
    if (value < 0)
        return "red";
    return "black";
}

function getCommaValue(value) {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

function setHeight() {
    $(".account").innerHeight(window.innerHeight);
}

function getDayClass(day) {
	if (day == "토") {
		return "saturday";
	} else if (day == "일") {
		return "sunday";
	} else {
		return "normal";
	}
}

Date.prototype.format = function(f) {
	if (!this.valueOf())
		return " ";
	var weekName = [ "일", "월", "화", "수", "목", "금", "토" ];
	var d = this;
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
