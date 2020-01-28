var sizeCircle = 5 ;
var sizeCircleName = 10 ;
var goColor = "#0fbeff" ;
var goalColor = "#00ff74" ;
var nodes = [];
var nodeStartId = null ;
var nodeGoalId = null ;
var edge = {};
var indexOfNodes = 0 ;


function getResult() {
    if ( nodeStartId == null || nodeGoalId == null ){
        alert('Please select Start and Goal Nodes!');
        return;
    }
    let aStar = new astar();
    aStar.init(nodes,edge,nodes[nodeStartId],nodes[nodeGoalId]);
    var resultNodes = aStar.getResult();
    var resultHint = aStar.getQueuePerEachRow();
    if (resultNodes === "no way !!"){
        alert('Can Not find path between Start and Goal Node!');
        return;
    }
    var lastNodeName = null ;
    for ( var i = 0 ; i < resultNodes.length ; i++ ){
        var id =  resultNodes[i].id ;
        nodes[id].color = goColor;
        if ( lastNodeName !== null ){
            edge[lastNodeName][ nodes[id].name ].color = goColor ;
        }
        lastNodeName = nodes[id].name ;
    }
    nodes[nodeGoalId].color = goalColor;
    reDrawCanvas(false);

    var stringHint = "" ;
    for ( i = 0 ; i < resultHint.length ; i++ ){
        stringHint += '<p style="margin-top: 10px;"><strong>level '+i+' queue :</strong> { ';
        for ( var i2 = 0 ; i2 < resultHint[i].length ; i2++ ){
            if ( i2 === 0 )
                stringHint += ' [ '+ resultHint[i][i2].nodes +' , <strong style="cursor: pointer;" title="f() = g() + h() = '+resultHint[i][i2].g +' + '+ resultHint[i][i2].h +' = '+resultHint[i][i2].f +' ">' +  resultHint[i][i2].f + '</strong> ] ';
            else
                stringHint += ' , [ '+ resultHint[i][i2].nodes +' , <strong style="cursor: pointer;" title="f() = g() + h() = '+resultHint[i][i2].g +' + '+ resultHint[i][i2].h +' = '+resultHint[i][i2].f +' ">' +  resultHint[i][i2].f + '</strong> ] ';
        }
        stringHint += ' } </p><hr>';
    }
    $("#hint").html(stringHint);
}

function saveData() {
    var data = { nodes : nodes , nodeStartId : nodeStartId ,nodeGoalId : nodeGoalId , edge : edge , indexOfNodes : indexOfNodes };
    bake_cookie(data);
}
function loadData(exampleId) {
    var data = read_cookie(exampleId);
    nodes = data.nodes;
    nodeStartId = data.nodeStartId;
    nodeGoalId = data.nodeGoalId;
    edge = data.edge;
    indexOfNodes = data.indexOfNodes;
    reDrawCanvas(true);
}

function canvasClick (e) {
    var addNodeTag = true ;
    var hp = getMousePos(canvas, e);
    for ( index = 0 ; index < indexOfNodes ; index++ ){
        if (  Math.abs( nodes[index].x - hp.x ) <= sizeCircle  && Math.abs( nodes[index].y - hp.y ) <= sizeCircle ) {
            addNodeTag = false ;
            var doAction = true ;
            if($('#addEdge').is(':checked') && doAction) {
                startAddEdge(nodes[index]);
                doAction = false ;
            } else if($('#selectStart').is(':checked') && doAction) {
                selectStart(index);
                doAction = false ;
            } else if($('#selectGoal').is(':checked') && doAction) {
                selectGoal(index);
                doAction = false ;
            }
        }
    }
    if ( addNodeTag ) {
        if($('#addNode').is(':checked')) {
            addNode(hp);
        }
    }
}
function addNode ( hp ){
    var name = String.fromCharCode(65 + indexOfNodes) ;
    drawNode(hp.x ,  hp.y , name , "#fff5f5");
    nodes[indexOfNodes] = {x: hp.x, y: hp.y, name: name , color: "#fff5f5" , id:indexOfNodes};
    indexOfNodes++;
}
var tempStartEdge = false ;
var tempNode = null;
function startAddEdge(node) {
    if ( ! tempStartEdge  ) {
        tempStartEdge = true;
        tempNode = node ;
        $('#canvas').mousemove(function (e) {
            if ( tempStartEdge  ) {
                reDrawCanvas(false);
                var hp = getMousePos(canvas, e);
                drawEdge(node.x, node.y, hp.x, hp.y, node.name ,"" , "" , "#fff5f5" );
            }
        });
    } else if ( node.name !== tempNode.name ) {
        tempStartEdge = false;
        if (typeof edge[tempNode.name] == "undefined") {
            edge[tempNode.name] = {};
        }
        if ( typeof edge[tempNode.name][node.name] == "undefined" ) {
            do {
                var cost = prompt("Please enter the Cost. ( more than 0 )");
            } while ( ! parseInt(cost) > 0 ) ;
            edge[tempNode.name][node.name] = {startNode: tempNode, endNode: node, cost: cost , color : "#fff5f5" };
        }
        reDrawCanvas(false);
        tempNode = null;
    }
}
function resetCanvas(){
    location.reload();
}
function selectStart(nodeSelectedId){
    nodes[nodeSelectedId].color = goColor;
    nodeStartId = nodeSelectedId ;
    $("#selectGoal").prop("checked", true);
    reDrawCanvas(false);
    $("#selectStartDiv").html("<div style='margin:5px;'>Start Node : "+nodes[nodeSelectedId].name+"</div>");
}
function selectGoal(nodeSelectedId){
    nodes[nodeSelectedId].color = goalColor;
    nodeGoalId = nodeSelectedId ;
    reDrawCanvas(false);
    $("#selectGoalDiv").html("<div style='margin:5px;'>Goal Node : "+nodes[nodeSelectedId].name+"</div>");
}
$('document').ready(function(){
    var canvasDiv = document.getElementById('canvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'canvas');
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");

    $('#canvas').click(function(e){
        canvasClick(e);
    });

});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}
function drawEdge(startX , startY , EndX , EndY , StartName , EndName , Cost , color) {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(startX, startY);
    if ( startY > EndY || ( ( startX > EndX ) && startY === EndY ) ) {
        EndYMid = Math.abs(EndY + startY) / 2 - 5;
        EndXMid = Math.abs(EndX + startX) / 2 - 5;
    } else {
        EndYMid = Math.abs(EndY + startY) / 2 + 5;
        EndXMid = Math.abs(EndX + startX) / 2 + 5;
    }
    context.lineTo(EndXMid, EndYMid);
    context.stroke();
    context.moveTo(EndXMid, EndYMid);
    context.lineTo(EndX, EndY);
    context.stroke();
    var text = StartName + EndName + ":" + Cost ;
    context.fillStyle = "#000000";
    context.font = "8px Arial";
    context.fillText(text,  EndXMid   ,  EndYMid);

}
function drawNode(X,Y , name, color) {
    context.beginPath();
    context.arc(X, Y, sizeCircle, 0, 2 * Math.PI, false);
    context.fillStyle = color ;
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    context.fillStyle = "#000000";
    context.font = sizeCircleName+"px Arial";
    context.fillText(name, X - ( sizeCircle / 2 ) , Y + ( sizeCircle / 2 ));
}

function reDrawCanvas( reDrawHtml ) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    $.each(edge, function( edgeStartName, oneEdgeOfStarterNode ) {
        $.each(oneEdgeOfStarterNode, function( edgeEndName, oneEdge ) {
            drawEdge(oneEdge.startNode.x, oneEdge.startNode.y, oneEdge.endNode.x ,  oneEdge.endNode.y  , oneEdge.startNode.name ,oneEdge.endNode.name , oneEdge.cost, oneEdge.color );
        });
    });
    if ( reDrawHtml ) {
        $('#listNodes').html('');
        $('#hint').html('');
    }
    for (index = 0; index < indexOfNodes; index++) {
        if ( reDrawHtml ) {
            $('#listNodes').append('<tr id="nodeName_' + nodes[index].name + '"><td>' + nodes[index].name + '</td><td>' + nodes[index].heuristic + '</td></tr>');
            if ( nodeStartId != null)
                $("#selectStartDiv").html("<div style='margin:5px;'>Start Node : " + nodes[nodeStartId].name + "</div>");
            if ( nodeGoalId != null)
                $("#selectGoalDiv").html("<div style='margin:5px;'>Goal Node : " + nodes[nodeGoalId].name + "</div>");
        }
        drawNode(nodes[index].x, nodes[index].y, nodes[index].name, nodes[index].color);
    }
}
function bake_cookie(value) {
    var date = new Date();
    date.setTime(date.getTime() + (3*24*60*60*1000));
    var expires = "; expires=" + date.toUTCString();
    document.cookie =  "graphData=" + ( (JSON.stringify(value)) || "")  + expires + "; path=/";
    console.log(JSON.stringify(value));
}
function read_cookie(exampleId) {
    if ( exampleId === 1 ){
        var text =
            '{"nodes":[{"x":21.714283776661706,"y":118.47272768887606,"name":"A","heuristic":"4","color":"#0fbeff","id":0},{"x":65.52380758618551,"y":66.65454587069424,"name":"B","heuristic":"2","color":"#fff5f5","id":1},{"x":127.1111091734871,"y":29.836364052512426,"name":"C","heuristic":"6","color":"#fff5f5","id":2},{"x":121.39682345920139,"y":98.56363677978514,"name":"D","heuristic":"2","color":"#fff5f5","id":3},{"x":203.30158536396328,"y":70.74545496160333,"name":"E","heuristic":"3","color":"#fff5f5","id":4},{"x":236.95237901475693,"y":132.38181859796697,"name":"F","heuristic":"1","color":"#00ff74","id":5}],"nodeStartId":0,"nodeGoalId":5,"edge":{"A":{"B":{"startNode":{"x":21.714283776661706,"y":118.47272768887606,"name":"A","heuristic":"4","color":"#0fbeff","id":0},"endNode":{"x":65.52380758618551,"y":66.65454587069424,"name":"B","heuristic":"2","color":"#fff5f5","id":1},"cost":"1","color":"#fff5f5"},"F":{"startNode":{"x":21.714283776661706,"y":118.47272768887606,"name":"A","heuristic":"4","color":"#0fbeff","id":0},"endNode":{"x":236.95237901475693,"y":132.38181859796697,"name":"F","heuristic":"1","color":"#00ff74","id":5},"cost":"12","color":"#fff5f5"}},"B":{"C":{"startNode":{"x":65.52380758618551,"y":66.65454587069424,"name":"B","heuristic":"2","color":"#fff5f5","id":1},"endNode":{"x":127.1111091734871,"y":29.836364052512426,"name":"C","heuristic":"6","color":"#fff5f5","id":2},"cost":"3","color":"#fff5f5"},"D":{"startNode":{"x":65.52380758618551,"y":66.65454587069424,"name":"B","heuristic":"2","color":"#fff5f5","id":1},"endNode":{"x":121.39682345920139,"y":98.56363677978514,"name":"D","heuristic":"2","color":"#fff5f5","id":3},"cost":"1","color":"#fff5f5"}},"C":{"E":{"startNode":{"x":127.1111091734871,"y":29.836364052512426,"name":"C","heuristic":"6","color":"#fff5f5","id":2},"endNode":{"x":203.30158536396328,"y":70.74545496160333,"name":"E","heuristic":"3","color":"#fff5f5","id":4},"cost":"3","color":"#fff5f5"}},"E":{"F":{"startNode":{"x":203.30158536396328,"y":70.74545496160333,"name":"E","heuristic":"3","color":"#fff5f5","id":4},"endNode":{"x":236.95237901475693,"y":132.38181859796697,"name":"F","heuristic":"1","color":"#00ff74","id":5},"cost":"3","color":"#fff5f5"}},"D":{"E":{"startNode":{"x":121.39682345920139,"y":98.56363677978514,"name":"D","heuristic":"2","color":"#fff5f5","id":3},"endNode":{"x":203.30158536396328,"y":70.74545496160333,"name":"E","heuristic":"3","color":"#fff5f5","id":4},"cost":"2","color":"#fff5f5"},"F":{"startNode":{"x":121.39682345920139,"y":98.56363677978514,"name":"D","heuristic":"2","color":"#fff5f5","id":3},"endNode":{"x":236.95237901475693,"y":132.38181859796697,"name":"F","heuristic":"1","color":"#00ff74","id":5},"cost":"2","color":"#fff5f5"}}},"indexOfNodes":6}'
        ;
        return JSON.parse(text);
    }else if ( exampleId === 2 ){
        var text =
            '{"nodes":[{"x":27.746029808407737,"y":72.38181859796697,"name":"A","heuristic":"7","color":"#0fbeff","id":0},{"x":83.30158536396328,"y":31.20000041614879,"name":"B","heuristic":"6","color":"#fff5f5","id":1},{"x":82.03174409412202,"y":114.92727314342152,"name":"C","heuristic":"2","color":"#fff5f5","id":2},{"x":137.9047599671379,"y":72.38181859796697,"name":"D","heuristic":"1","color":"#fff5f5","id":3},{"x":214.7301567925347,"y":70.47272768887606,"name":"E","heuristic":"1","color":"#00ff74","id":4}],"nodeStartId":0,"nodeGoalId":4,"edge":{"A":{"B":{"startNode":{"x":27.746029808407737,"y":72.38181859796697,"name":"A","heuristic":"7","color":"#0fbeff","id":0},"endNode":{"x":83.30158536396328,"y":31.20000041614879,"name":"B","heuristic":"6","color":"#fff5f5","id":1},"cost":"1","color":"#fff5f5"},"C":{"startNode":{"x":27.746029808407737,"y":72.38181859796697,"name":"A","heuristic":"7","color":"#0fbeff","id":0},"endNode":{"x":82.03174409412202,"y":114.92727314342152,"name":"C","heuristic":"2","color":"#fff5f5","id":2},"cost":"4","color":"#fff5f5"}},"B":{"C":{"startNode":{"x":83.30158536396328,"y":31.20000041614879,"name":"B","heuristic":"6","color":"#fff5f5","id":1},"endNode":{"x":82.03174409412202,"y":114.92727314342152,"name":"C","heuristic":"2","color":"#fff5f5","id":2},"cost":"2","color":"#fff5f5"},"D":{"startNode":{"x":83.30158536396328,"y":31.20000041614879,"name":"B","heuristic":"6","color":"#fff5f5","id":1},"endNode":{"x":137.9047599671379,"y":72.38181859796697,"name":"D","heuristic":"1","color":"#fff5f5","id":3},"cost":"5","color":"#fff5f5"},"E":{"startNode":{"x":83.30158536396328,"y":31.20000041614879,"name":"B","heuristic":"6","color":"#fff5f5","id":1},"endNode":{"x":214.7301567925347,"y":70.47272768887606,"name":"E","heuristic":"1","color":"#00ff74","id":4},"cost":"12","color":"#fff5f5"}},"C":{"D":{"startNode":{"x":82.03174409412202,"y":114.92727314342152,"name":"C","heuristic":"2","color":"#fff5f5","id":2},"endNode":{"x":137.9047599671379,"y":72.38181859796697,"name":"D","heuristic":"1","color":"#fff5f5","id":3},"cost":"2","color":"#fff5f5"}},"D":{"E":{"startNode":{"x":137.9047599671379,"y":72.38181859796697,"name":"D","heuristic":"1","color":"#fff5f5","id":3},"endNode":{"x":214.7301567925347,"y":70.47272768887606,"name":"E","heuristic":"1","color":"#00ff74","id":4},"cost":"3","color":"#fff5f5"}}},"indexOfNodes":5}'
        ;
        return JSON.parse(text);
    }else if ( exampleId === 3 ){
        var text =
            '{"nodes":[{"x":30.285712348090275,"y":17.563636779785156,"name":"A","heuristic":"4","color":"#0fbeff","id":0},{"x":40.12698218936011,"y":63.109091325239696,"name":"B","heuristic":"4","color":"#fff5f5","id":1},{"x":83.30158536396328,"y":97.20000041614878,"name":"C","heuristic":"2","color":"#fff5f5","id":2},{"x":47.746029808407734,"y":140.0181822343306,"name":"D","heuristic":"4","color":"#fff5f5","id":3},{"x":135.04761710999503,"y":14.290909507057883,"name":"E","heuristic":"4","color":"#fff5f5","id":4},{"x":168.06349012586804,"y":59.56363677978515,"name":"F","heuristic":"2","color":"#fff5f5","id":5},{"x":178.53968060205852,"y":116.83636405251242,"name":"G","heuristic":"1","color":"#00ff74","id":6}],"nodeStartId":0,"nodeGoalId":6,"edge":{"A":{"E":{"startNode":{"x":30.285712348090275,"y":17.563636779785156,"name":"A","heuristic":"4","color":"#0fbeff","id":0},"endNode":{"x":135.04761710999503,"y":14.290909507057883,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"2","color":"#fff5f5"},"B":{"startNode":{"x":30.285712348090275,"y":17.563636779785156,"name":"A","heuristic":"4","color":"#0fbeff","id":0},"endNode":{"x":40.12698218936011,"y":63.109091325239696,"name":"B","heuristic":"4","color":"#fff5f5","id":1},"cost":"1","color":"#fff5f5"}},"E":{"F":{"startNode":{"x":135.04761710999503,"y":14.290909507057883,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"endNode":{"x":168.06349012586804,"y":59.56363677978515,"name":"F","heuristic":"2","color":"#fff5f5","id":5},"cost":"3","color":"#fff5f5"}},"F":{"G":{"startNode":{"x":168.06349012586804,"y":59.56363677978515,"name":"F","heuristic":"2","color":"#fff5f5","id":5},"endNode":{"x":178.53968060205852,"y":116.83636405251242,"name":"G","heuristic":"1","color":"#00ff74","id":6},"cost":"2","color":"#fff5f5"}},"B":{"C":{"startNode":{"x":40.12698218936011,"y":63.109091325239696,"name":"B","heuristic":"4","color":"#fff5f5","id":1},"endNode":{"x":83.30158536396328,"y":97.20000041614878,"name":"C","heuristic":"2","color":"#fff5f5","id":2},"cost":"2","color":"#fff5f5"}},"C":{"D":{"startNode":{"x":83.30158536396328,"y":97.20000041614878,"name":"C","heuristic":"2","color":"#fff5f5","id":2},"endNode":{"x":47.746029808407734,"y":140.0181822343306,"name":"D","heuristic":"4","color":"#fff5f5","id":3},"cost":"3","color":"#fff5f5"}},"D":{"G":{"startNode":{"x":47.746029808407734,"y":140.0181822343306,"name":"D","heuristic":"4","color":"#fff5f5","id":3},"endNode":{"x":178.53968060205852,"y":116.83636405251242,"name":"G","heuristic":"1","color":"#00ff74","id":6},"cost":"4","color":"#fff5f5"}}},"indexOfNodes":7}'
        ;
        return JSON.parse(text);
    }else if ( exampleId === 4 ){
        var text =
            '{"nodes":[{"x":9.333331395709324,"y":70.74545496160333,"name":"A","heuristic":"14","color":"#0fbeff","id":0},{"x":94.4126964750744,"y":21.92727314342152,"name":"B","heuristic":"12","color":"#fff5f5","id":1},{"x":75.68253774491566,"y":94.20000041614878,"name":"C","heuristic":"11","color":"#fff5f5","id":2},{"x":194.7301567925347,"y":21.381818597966973,"name":"D","heuristic":"11","color":"#fff5f5","id":3},{"x":189.015871078249,"y":77.56363677978516,"name":"E","heuristic":"4","color":"#fff5f5","id":4},{"x":142.66666472904265,"y":122.83636405251242,"name":"F","heuristic":"6","color":"#fff5f5","id":5},{"x":269.96825203062997,"y":55.20000041614879,"name":"G","heuristic":"1","color":"#00ff74","id":6}],"nodeStartId":0,"nodeGoalId":6,"edge":{"A":{"C":{"startNode":{"x":9.333331395709324,"y":70.74545496160333,"name":"A","heuristic":"14","color":"#0fbeff","id":0},"endNode":{"x":75.68253774491566,"y":94.20000041614878,"name":"C","heuristic":"11","color":"#fff5f5","id":2},"cost":"3","color":"#fff5f5"},"B":{"startNode":{"x":9.333331395709324,"y":70.74545496160333,"name":"A","heuristic":"14","color":"#0fbeff","id":0},"endNode":{"x":94.4126964750744,"y":21.92727314342152,"name":"B","heuristic":"12","color":"#fff5f5","id":1},"cost":"4","color":"#fff5f5"}},"B":{"D":{"startNode":{"x":94.4126964750744,"y":21.92727314342152,"name":"B","heuristic":"12","color":"#fff5f5","id":1},"endNode":{"x":194.7301567925347,"y":21.381818597966973,"name":"D","heuristic":"11","color":"#fff5f5","id":3},"cost":"5","color":"#fff5f5"},"E":{"startNode":{"x":94.4126964750744,"y":21.92727314342152,"name":"B","heuristic":"12","color":"#fff5f5","id":1},"endNode":{"x":189.015871078249,"y":77.56363677978516,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"12","color":"#fff5f5"}},"F":{"E":{"startNode":{"x":142.66666472904265,"y":122.83636405251242,"name":"F","heuristic":"6","color":"#fff5f5","id":5},"endNode":{"x":189.015871078249,"y":77.56363677978516,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"2","color":"#fff5f5"}},"C":{"E":{"startNode":{"x":75.68253774491566,"y":94.20000041614878,"name":"C","heuristic":"11","color":"#fff5f5","id":2},"endNode":{"x":189.015871078249,"y":77.56363677978516,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"10","color":"#fff5f5"},"F":{"startNode":{"x":75.68253774491566,"y":94.20000041614878,"name":"C","heuristic":"11","color":"#fff5f5","id":2},"endNode":{"x":142.66666472904265,"y":122.83636405251242,"name":"F","heuristic":"6","color":"#fff5f5","id":5},"cost":"7","color":"#fff5f5"}},"D":{"G":{"startNode":{"x":194.7301567925347,"y":21.381818597966973,"name":"D","heuristic":"11","color":"#fff5f5","id":3},"endNode":{"x":269.96825203062997,"y":55.20000041614879,"name":"G","heuristic":"1","color":"#00ff74","id":6},"cost":"16","color":"#fff5f5"}},"E":{"G":{"startNode":{"x":189.015871078249,"y":77.56363677978516,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"endNode":{"x":269.96825203062997,"y":55.20000041614879,"name":"G","heuristic":"1","color":"#00ff74","id":6},"cost":"5","color":"#fff5f5"}}},"indexOfNodes":7}'
        ;
        return JSON.parse(text);
    }else if ( exampleId === 5 ){
        var text =
            '{"nodes":[{"x":8.063490125868055,"y":78.38181859796697,"name":"A","heuristic":"17","color":"#0fbeff","id":0},{"x":77.90475996713789,"y":14.836364052512428,"name":"B","heuristic":"10","color":"#fff5f5","id":1},{"x":95.04761710999503,"y":75.38181859796697,"name":"C","heuristic":"13","color":"#fff5f5","id":2},{"x":57.90475996713789,"y":127.20000041614878,"name":"D","heuristic":"4","color":"#fff5f5","id":3},{"x":159.4920615544395,"y":37.20000041614879,"name":"E","heuristic":"4","color":"#fff5f5","id":4},{"x":155.68253774491566,"y":113.56363677978514,"name":"F","heuristic":"2","color":"#fff5f5","id":5},{"x":209.96825203062994,"y":73.74545496160333,"name":"G","heuristic":"1","color":"#fff5f5","id":6},{"x":265.8412679036458,"y":38.01818223433061,"name":"H","heuristic":"1","color":"#00ff74","id":7}],"nodeStartId":0,"nodeGoalId":7,"edge":{"A":{"B":{"startNode":{"x":8.063490125868055,"y":78.38181859796697,"name":"A","heuristic":"17","color":"#0fbeff","id":0},"endNode":{"x":77.90475996713789,"y":14.836364052512428,"name":"B","heuristic":"10","color":"#fff5f5","id":1},"cost":"6","color":"#fff5f5"},"C":{"startNode":{"x":8.063490125868055,"y":78.38181859796697,"name":"A","heuristic":"17","color":"#0fbeff","id":0},"endNode":{"x":95.04761710999503,"y":75.38181859796697,"name":"C","heuristic":"13","color":"#fff5f5","id":2},"cost":"5","color":"#fff5f5"},"D":{"startNode":{"x":8.063490125868055,"y":78.38181859796697,"name":"A","heuristic":"17","color":"#0fbeff","id":0},"endNode":{"x":57.90475996713789,"y":127.20000041614878,"name":"D","heuristic":"4","color":"#fff5f5","id":3},"cost":"10","color":"#fff5f5"}},"B":{"E":{"startNode":{"x":77.90475996713789,"y":14.836364052512428,"name":"B","heuristic":"10","color":"#fff5f5","id":1},"endNode":{"x":159.4920615544395,"y":37.20000041614879,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"6","color":"#fff5f5"}},"E":{"G":{"startNode":{"x":159.4920615544395,"y":37.20000041614879,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"endNode":{"x":209.96825203062994,"y":73.74545496160333,"name":"G","heuristic":"1","color":"#fff5f5","id":6},"cost":"4","color":"#fff5f5"}},"G":{"H":{"startNode":{"x":209.96825203062994,"y":73.74545496160333,"name":"G","heuristic":"1","color":"#fff5f5","id":6},"endNode":{"x":265.8412679036458,"y":38.01818223433061,"name":"H","heuristic":"1","color":"#00ff74","id":7},"cost":"3","color":"#fff5f5"}},"C":{"E":{"startNode":{"x":95.04761710999503,"y":75.38181859796697,"name":"C","heuristic":"13","color":"#fff5f5","id":2},"endNode":{"x":159.4920615544395,"y":37.20000041614879,"name":"E","heuristic":"4","color":"#fff5f5","id":4},"cost":"6","color":"#fff5f5"},"F":{"startNode":{"x":95.04761710999503,"y":75.38181859796697,"name":"C","heuristic":"13","color":"#fff5f5","id":2},"endNode":{"x":155.68253774491566,"y":113.56363677978514,"name":"F","heuristic":"2","color":"#fff5f5","id":5},"cost":"7","color":"#fff5f5"}},"D":{"F":{"startNode":{"x":57.90475996713789,"y":127.20000041614878,"name":"D","heuristic":"4","color":"#fff5f5","id":3},"endNode":{"x":155.68253774491566,"y":113.56363677978514,"name":"F","heuristic":"2","color":"#fff5f5","id":5},"cost":"6","color":"#fff5f5"}},"F":{"G":{"startNode":{"x":155.68253774491566,"y":113.56363677978514,"name":"F","heuristic":"2","color":"#fff5f5","id":5},"endNode":{"x":209.96825203062994,"y":73.74545496160333,"name":"G","heuristic":"1","color":"#fff5f5","id":6},"cost":"6","color":"#fff5f5"}}},"indexOfNodes":8}'
        ;
        return JSON.parse(text);
    }
    var nameEQ = "graphData=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
    }
    return null;
}