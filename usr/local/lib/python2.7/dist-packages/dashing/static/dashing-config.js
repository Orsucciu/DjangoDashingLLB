/* global $, dashboard */

//initialisation des varriables

var dashboard = new Dashboard();



function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

if ((readCookie("url") == "")){
    createCookie("url","",7);
}


var url1 = "http://10.22.50.0:61208";
var url2 = "http://172.16.150.0:61208";
var url3 = "http://10.22.50.134:61208";
var url4 = "http://172.16.0.150:61208";
var url = readCookie("url");

if (url == url1){
        url = url2;
    }else if(url == url2){
        url = url3;        
    }else if(url == url3){
        url = url4;
    }else if(url == url4){
        url = url1;
    }else {
        url = url1;
    }

createCookie("url", url, 7);

//CREATION DES WIDGETS

//creation widget qui contient le nom et l'IP du serveur 
dashboard.addWidget('infoServer_widget', 'List', {
    getData: function () {
        $.extend(this.scope, {
            
            data: [{label: ' ', value: getName(url)},
                   {label: ' ', value: getIP(url)},,]
        });
    }
});

//creation widget qui contient la date de l'uptime du serveur
dashboard.addWidget('buzzwords_widget', 'List', {
    getData: function () {
        $.extend(this.scope, {
            
            data: [{label: 'Uptime:', value: getUPT(url)},]
        });
    }
});


//creation widget qui affiche le pourcentage d'utilisation du CPU
dashboard.addWidget('cpu_widget', 'Knob',{
        getData: function () { 
        this.interval= 10000;
            $.extend(this.scope, {
            title: 'CPU Load',
            value: getCPU(url),
            data:  {angleArc: 250,
                    dynamicDraw: true,
                    fgColor: '#90ee90',
                    angleOffset: -125,
                    displayInput: true,
                    min: 0,
                    max: 100,
                    draw : function () {
                    $(this.i).val( parseInt(this.cv) + '%');},
                    readOnly: true}
                    });
                }
});

//creation widget qui affiche le pourcentage d'utilisation de la SWAP
dashboard.addWidget('swap_widget', 'Knob',{
        getData: function () { 
        this.interval= 10000;
            $.extend(this.scope, {
            title: '% SWAP',
            value: getSWAP(url),
            data:  {angleArc: 250,
                    fgColor: '#90ee90',
                    angleOffset: -125,
                    displayInput: true,
                    min: 0,
                    max: 100,
                    readOnly: true}
                    });
                }
});

//creation widget qui affiche le pourcentage d'utilisation de la mémoire vive
dashboard.addWidget('mem_widget', 'Knob',{
        getData: function () { 
        this.interval= 10000;
            $.extend(this.scope, {
            title: '% RAM',
            value: getRAM(url),
            data:  {angleArc: 250,
                    fgColor: '#90ee90',
                    angleOffset: -125,
                    displayInput: true,
                    min: 0,
                    max: 100,
                    readOnly: true}
                    });
                }
});

//creation widget qui affiche le pourcentage d'espace disque libre à la racine
dashboard.addWidget('allocation_widget', 'Knob',{
        getData: function () { 
        this.interval= 1000000000;
            $.extend(this.scope, {
            title: ' % Espace disque utilisé',
            value: getAllocationDisque(url),
            data:  {angleArc: 250,
                    fgColor: '#90ee90',
                    angleOffset: -125,
                    displayInput: true,
                    min: 0,
                    max: 100,
                    readOnly: true}
                    });
                }
});

//retourne l'utilisation du CPU en pourcentage
function getCPU(url){
    var cpu;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/cpu"),
        data: "format=json",
        success: function(data){

        cpu = Math.round(((100 - data.idle)*100)/100);
        
        }
    });
    return cpu;
}

//retourne l'utilisation de l'espace disque en pourcentage
function getAllocationDisque(url){
    var allocation;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/fs/percent"),
        data: "format=json",
        success: function(data){

        allocation = Math.round(data.percent[0]);
        //alert(data.used[1]);
        }
    });
    return allocation;
}

//retourne la date de la denière uptime
function getUPT(url){
    var upt;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/uptime"),
        data: "format=json",
        success: function(data){

        upt = data;
        
        }
    });
    return upt;
}

//retourne l'IP du serveur 
function getIP(url){
    var ip;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/ip"),
        data: "format=json",
        success: function(data){

        ip = data.address;
        
        }
    });
    return ip;
}

//retourne le nom du serveur
function getName(url){
    var name;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/system"),
        data: "format=json",
        success: function(data){
        name = data.hostname;
        
        }
    });
    return name;
}

//retourne l'utilisation de la SWAP en pourcentage
function getSWAP(url){
    var swap;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/memswap"),
        data: "format=json",
        success: function(data){

        swap = data.percent;
        
        }
    });
    return swap;
}

//retourne l'utilisation de la mémoire vive en pourcentage
function getRAM(url){
    var ram;
    $.ajax({
        async: false,
        dataType: "json",
        url: url.concat("/api/2/mem"),
        data: "format=json",
        success: function(data){

        ram = data.percent;
        
        }
    });
    return ram;
}



//rafraîchit la page et change le serveur interrogé
setTimeout(function(){
    /*if (url == url1){
        url = url2;
    }else if(url == url2){
        url = url3;        
    }else if(url == url3){
        url = url4;
    }else if(url == url4){
        url = url1;
    }
    localStorage.setItem("url", url);*/
    window.location.reload();
    //window.location.href = "http://10.22.50.178:8000/dashboard/#/";
    
 }, 10000);





