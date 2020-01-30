class all_source_shortest_path {

    constructor(nodes,edges) {
        this.nodes = nodes;
        this.edges = edges;

        this.matrix = [ ] ;
        this.matrix[0] = [ ] ;
        for (var index = 0; index < this.nodes.length; index++) {
            this.matrix[0][index]= [];
            for (var index2 = 0; index2 < this.nodes.length; index2++) {
                if ( index === index2 ){
                    this.matrix[0][index][index2] = { parentNode : [] , cost : 0 };
                } else {
                    var startNode = this.nodes[index];
                    var endNode = this.nodes[index2];
                    if ( ! ( typeof this.edges[startNode.name] == "undefined" ) ) {
                        if (  ! ( typeof this.edges[startNode.name][endNode.name] == "undefined" ) ) {
                            var thisEdge = this.edges[startNode.name][endNode.name] ;
                            this.matrix[0][index][index2] = { parentNode : [] , cost : parseInt ( thisEdge.cost ) } ;
                        } else
                            this.matrix[0][index][index2] = { parentNode : [] , cost : Number.MAX_SAFE_INTEGER };
                    } else
                        this.matrix[0][index][index2] = { parentNode : [] , cost : Number.MAX_SAFE_INTEGER };
                }
            }
        }
    }

    run(){
        for (var indexMatrix = 1; indexMatrix <= this.nodes.length; indexMatrix++) {
            this.matrix[indexMatrix] = [] ;
            for (var index = 0; index < this.nodes.length; index++) {
                this.matrix[indexMatrix][index] = [] ;
                for (var index2 = 0; index2 < this.nodes.length; index2++) {
                    this.matrix[indexMatrix][index][index2] = {};
                    this.matrix[indexMatrix][index][index2].parentNode = [];
                    if ( index === indexMatrix - 1 ){
                        this.matrix[indexMatrix][index][index2].cost = this.matrix[ ( indexMatrix - 1 ) ][index][index2].cost;
                        this.matrix[indexMatrix][index][index2].parentNode = this.matrix[(indexMatrix - 1)][index][index2].parentNode;
                    } else if ( index2 === indexMatrix - 1 ) {
                        this.matrix[indexMatrix][index][index2].cost = this.matrix[ ( indexMatrix - 1 ) ][index][index2].cost;
                        this.matrix[indexMatrix][index][index2].parentNode = this.matrix[(indexMatrix - 1)][index][index2].parentNode;
                    } else {
                        var minCost = this.matrix[(indexMatrix - 1)][index][index2].cost;
                        var minCostType2 = this.matrix[(indexMatrix - 1)][index][(indexMatrix - 1)].cost + this.matrix[(indexMatrix - 1)][(indexMatrix - 1)][index2].cost;
                        if ( minCost <= minCostType2 ){
                            this.matrix[indexMatrix][index][index2].cost = minCost;
                            this.matrix[indexMatrix][index][index2].parentNode = this.matrix[(indexMatrix - 1)][index][index2].parentNode;
                        } else {
                            this.matrix[indexMatrix][index][index2].cost = minCostType2;
                            var parentNodes = [];
                            parentNodes.push(this.edges[ ( this.nodes[index].name ) ][( this.nodes[(indexMatrix - 1)].name )]);
                            parentNodes.push(this.edges[ ( this.nodes[(indexMatrix - 1)].name ) ][( this.nodes[index2].name )]);
                            this.matrix[indexMatrix][index][index2].parentNode = parentNodes.concat(this.matrix[(indexMatrix - 1)][index][(indexMatrix - 1)].parentNode.concat(this.matrix[(indexMatrix - 1)][(indexMatrix - 1)][index2].parentNode)) ;
                        }
                    }
                }
            }
        }
    }

    getStepByStep(){
        return this.matrix;
    }

    getSourceToFinal(startNode,goalNode){
        var insertedNodes = this.matrix[ ( this.matrix.length - 1 ) ][startNode.id][goalNode.id].parentNode;
        var insertedNode = {} ;
        insertedNode.nodes = [] ;
        insertedNode.edges = [] ;
        for ( var i = 0 ; i < insertedNodes.length ; i++ )
            if ( typeof insertedNodes[i] != "undefined" ){
                insertedNode.edges.push(insertedNodes[i]);
                insertedNode.nodes.push(insertedNodes[i].startNode);
                insertedNode.nodes.push(insertedNodes[i].endNode);
            }

        if ( insertedNode.nodes.length > 0 ) {
            return insertedNode;
        } else if ( this.matrix[ ( this.matrix.length - 1 ) ][startNode.id][goalNode.id].cost < Number.MAX_VALUE ){
            insertedNode.edges.push( this.edges[(startNode.name)][(goalNode.name)] );
            insertedNode.nodes.push(startNode);
            insertedNode.nodes.push(goalNode);
            return insertedNode;
        }
        return 'no way !!';
    }
}