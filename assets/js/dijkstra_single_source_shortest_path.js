class dijkstra_single_source_shortest_path {

    constructor(nodes,edges,startNode) {
        this.nodes = nodes;
        this.edges = edges;
        this.starterNode = startNode;

        var startNodeID = this.starterNode.id ;

        this.queueRelaxation = [ ] ;
        for (var index = 0; index < this.nodes.length; index++) {
            if (this.nodes[index].id === startNodeID)
                this.nodes[startNodeID].degree = 0;
            else
                this.nodes[index].degree = Number.MAX_SAFE_INTEGER;
            this.nodes[index].parent = null;
            this.queueRelaxation.push(this.nodes[index]);
        }



        this.queueShow = [] ;
    }

    init(nodes,edges,startNode) {
        this.nodes = nodes;
        this.edges = edges;
        this.starterNode = startNode;

        var startNodeID = this.starterNode.id ;

        this.queueRelaxation = [ ] ;
        for (var index = 0; index < this.nodes.length; index++) {
            if (this.nodes[index].id === startNodeID)
                this.nodes[startNodeID].degree = 0;
            else
                this.nodes[index].degree = Number.MAX_SAFE_INTEGER;
            this.nodes[index].parent = null;
            this.queueRelaxation.push(this.nodes[index]);
        }


        this.queueShow = [] ;
    }

    relaxation(fromNode,indexInOfNode){
        if ( ! ( typeof this.edges[fromNode.name] == "undefined" ) ) {
            var thisEdge = this.edges[fromNode.name] ;
            for (var index in thisEdge) {
                // skip loop if the property is from prototype
                if (!thisEdge.hasOwnProperty(index)) continue;

                var thisEdgeEndNode = thisEdge[index].endNode ;
                if ( typeof thisEdgeEndNode.degree == "undefined" ) {
                    thisEdgeEndNode.degree = parseInt(fromNode.degree)  + parseInt ( thisEdge[index].cost ) ;
                    thisEdgeEndNode.parent = fromNode;
                } else
                if ( thisEdgeEndNode.degree > parseInt(fromNode.degree)  + parseInt ( thisEdge[index].cost ) ) {
                    thisEdgeEndNode.degree = parseInt(fromNode.degree)  + parseInt ( thisEdge[index].cost ) ;
                    thisEdgeEndNode.parent = fromNode;
                }
                this.nodes[thisEdgeEndNode.id].degree = thisEdgeEndNode.degree ;
                this.nodes[thisEdgeEndNode.id].parent = thisEdgeEndNode.parent ;
            }
        }
        this.queueRelaxation.splice(indexInOfNode , 1 );
    }


    run(){
        while (  this.queueRelaxation.length > 0 ) {
            var minimumDegree = Number.MAX_SAFE_INTEGER;
            var IdOfMinimumNode = null;
            for (var index in this.queueRelaxation) {
                // skip loop if the property is from prototype
                if (!this.queueRelaxation.hasOwnProperty(index)) continue;
                if (this.nodes[this.queueRelaxation[index].id].degree < minimumDegree) {
                    minimumDegree = this.nodes[this.queueRelaxation[index].id].degree;
                    IdOfMinimumNode = index;
                }
            }
            this.queueShow.push( {nodes :  JSON.parse(JSON.stringify(this.nodes)) , selectedNode : this.queueRelaxation[IdOfMinimumNode]  } );
            this.relaxation(this.queueRelaxation[IdOfMinimumNode],IdOfMinimumNode);
        }
    }

    getStepByStep(){
        return this.queueShow;
    }

    getSourceToFinal(goalNode){
        // this.nodes.sort((a,b) => (a.degree > b.degree) ? 1 : ((b.degree > a.degree) ? -1 : 0));
        var queueShow = [] ;
        do {
            var insertedNode = JSON.parse(JSON.stringify(this.nodes.find(x => x.id === goalNode.id)));
            goalNode = goalNode.parent;
            delete insertedNode["parent"];
            queueShow.unshift(insertedNode);
        } while ( goalNode.parent !== null ) ;
        if (! ( typeof queueShow[0] == "undefined" ) ) {
            if ( goalNode.id === this.starterNode.id ){
                insertedNode = JSON.parse(JSON.stringify(this.starterNode));
                delete insertedNode["parent"];
                queueShow.unshift(insertedNode);
                return queueShow ;
            }
        }
        return 'no way !!';
    }
}