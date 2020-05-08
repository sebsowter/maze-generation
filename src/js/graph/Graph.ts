export default class Graph { 
  noOfVertices: integer;
  adjList: any;

  // defining vertex array and 
  // adjacent list 
  constructor(noOfVertices) { 
      this.noOfVertices = noOfVertices; 
      this.adjList = new Map(); 
  } 

  // functions to be implemented 

  // addVertex(v) 
  // addEdge(v, w) 
  // printGraph() 

  // bfs(v) 
  // dfs(v) 

  // add vertex to the graph 
  public addVertex(v) { 
    // initialize the adjacent list with a 
    // null array 
    this.adjList.set(v, []); 
  } 


  public addEdge(v, w) { 
    // get the list for vertex v and put the 
    // vertex w denoting edge between v and w 
    this.adjList.get(v).push(w); 
  
    // Since graph is undirected, 
    // add an edge from w to v also 
    this.adjList.get(w).push(v); 
  } 

  public printGraph() { 
    console.log('-------------------------');
    // get all the vertices 
    var get_keys = this.adjList.keys(); 
  
    console.log('printGraph'); 
    console.log('get_keys', this.adjList); 
    // iterate over the vertices 

    this.adjList.forEach((node, i) => {
      console.log('i', node); 
      // great the corresponding adjacency list 
      // for the vertex 
      var get_values = this.adjList.get(i); 
      var conc = ""; 

      // iterate over the adjacency list 
      // concatenate the values into a string 
      for (var j in get_values) 
          conc += j + " "; 

      // print the vertex and its adjacency list 
      console.log(i + " -> " + conc);
     })
     
     console.log('-------------------------');
  }

  get list() {
    return this.adjList;
  }
}
