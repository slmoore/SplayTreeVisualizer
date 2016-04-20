/*

JavaScript Splay Tree

Description:
  A Splay Tree is a tree that rotates recently accessed nodes to the root.  
  The root rotation process is known as "splaying".

Purpose:
  Popular nodes will be quicker and more efficiently accessed.  
  If a tree contains many nodes, but only a small percentage are regularly used, 
  then it is more efficient to keep the recently accessed nodes closer to the root.

Methods:
  search
  insert
  remove
  min
  max
  inOrder
  rotateRight
  rotateLeft
  splay

Node properties:
  key
  val
  left
  right

Author:
  Shawn Moore

Original Binary Search Tree structure modeled after Java implementation by:
  Robert Sedgewick
  algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/BST.java

Splay Tree Operations modeled after Java implementation by:
  Josh Israel
  algs4.cs.princeton.edu/33balanced/SplayBst.java

Good References:
  http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf
  http://courses.cs.washington.edu/courses/cse326/01au/lectures/SplayTrees.ppt

*/

//Node Object Constructor
function Node(key,val) {
  this.key = key;
  this.val = val;
  this.left = null;
  this.right = null;
}

//Splay Tree Constructor
function SplayBst() {
  this.root = null;
}

//Get Node from Tree
//
//splaying handles the recursive tree traversal
//if the returned splay value is equal to the key
//then it is found, otherwise the closest
//value is now the root and null is returned
SplayBst.prototype.search = function(k) {
  if (this.root === null || (typeof k !== "number" && typeof k !== "string"))
    return null;

  this.splay(k);
  return this.root.key === k ? this.root : null;
};

//Put Node on Tree
//
//if the key does not exist this will insert
//a new node to the top of the tree
//
//new root links depend on the existing root key
SplayBst.prototype.insert = function(k,v) {
  var n;
  if ((typeof k !== "number" && typeof k !== "string") 
    || (typeof v !== "number" && typeof v !== "string")) {
    throw new Error("Invalid insert");
    return;
  }

  //there is no root yet
  if (this.root === null) {
    this.root = new Node(k,v);
    return;
  }
  //splay the closest existing match to the root
  this.splay(k);

  //if existing root key > new root key
  //link the existing left as the new left
  //and the current root becomes the new right
  if (this.root.key > k) {
    n = new Node(k,v);
    n.left = this.root.left;
    n.right = this.root;
    this.root.left = null;
    this.root = n;

  //if existing root key < new root key
  //link the existing right as the new right
  //and the current root becomes the new left
  } else if (this.root.key < k) {
    n = new Node(k,v);
    n.right = this.root.right;
    n.left = this.root;
    this.root.right = null;
    this.root = n;
  
  //existing root key === new root key
  //replace only the value
  } else {
    this.root.val = val;
  }

};

// Removal reassigns left and right links for the tree
// Garbage collector takes the node once it is disconnected
SplayBst.prototype.remove = function(k) {
  var temp;
  if (this.root === null || (typeof k !== "number" && typeof k !== "string"))
    return;
  //splay based on removal key
  this.splay(k);

  //continue if the key exists (now at root)
  if (this.root.key === k) {
  //no subtrees
    if (this.root.left === null && this.root.right === null) {
      this.root = null;
  //only right subtree
    } else if (this.root.left === null) {
      this.root = this.root.right;
  //both subtrees
  //unlink root and join subtrees
    } else {
      //store right subtree
      temp = this.root.right;
      //store left subtree
      this.root = this.root.left;
      //splay left subtree around the "max" key
      //after earlier splay, the removal key must be greater 
      //than the "max" of the left subtree
      //this means it can be used for this splay operation
      //the result is a left subtree with no right child
      this.splay(k);
      //reconnect right subtree
      this.root.right = temp;
    }
  }

};

//Get the Minimum Node
//
//key based
SplayBst.prototype.min = function(n) {
  var current;
  var minRecursive = function(cNode) {
    if (cNode.left) {
      return minRecursive(cNode.left);
    }
    return cNode;
  };

  if (this.root === null)
    return null;

  if (n instanceof Node)
    current = n;
  else
    current = this.root;

  return minRecursive(current);
};

//Get the Maximum Node
//
//key based
SplayBst.prototype.max = function(n) {
  var current;
  var maxRecursive = function(cNode) {
    if (cNode.right) {
      return maxRecursive(cNode.right);
    }
    return cNode;
  };

  if (this.root === null)
    return null;

  if (n instanceof Node)
    current = n;
  else
    current = this.root;

  return maxRecursive(current);
};

//In Order Traversal of Tree
//returns array of nodes in order
//
//Uses the implicit recursive stack to traverse to the
//leftmost child until null
//then perform action on the parent node
//then traverse to the first right child node
//and begin the process again
SplayBst.prototype.inOrder = function(n,nodeArray) {
  if (!Array.isArray(nodeArray)) {
    throw new Error("inOrder requires array");
  }

  if (n instanceof Node) {
    this.inOrder(n.left,nodeArray);
    nodeArray.push(n);
    this.inOrder(n.right,nodeArray);
  }
};

//Rotate node to the right
//(becomes right child of its left child)
SplayBst.prototype.rotateRight = function(n) {
  var temp;
  if (n instanceof Node) {
    temp = n.left;
    n.left = temp.right;
    temp.right = n;
  }
  return temp;
};

//Rotate node to the left
//(becomes left child of its right child)
SplayBst.prototype.rotateLeft = function(n) {
  var temp;
  if (n instanceof Node) {
    temp = n.right;
    n.right = temp.left;
    temp.left = n;
  }
  return temp;
};

// Splaying:
//  To “splay node x”, traverse up the tree from
//  node x to root, rotating along the way until x
//  is the root.
//
//  x === chosen node
//
//  For each rotation:
//    1. If x is the root, do nothing.
//    2. "Zig": If x has no grandparent, rotate x about its parent.
//    3. If x has a grandparent:
//      a. "Zig-Zig": if x and its parent are both left children or both right
//         children, rotate the parent about the grandparent, then
//         rotate x about its parent.
//      b. "Zig-Zag": if x and its parent are opposite type children (one left
//         and the other right), rotate x about its parent, then rotate
//         x about its new parent (former grandparent).
//
// Reference:
//  http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf
//
SplayBst.prototype.splay = function(k) {
  var splayRecursive = function(n, key) {
    //if empty return
    if (n === null)
      return null;

    //go left
    if (key < n.key) {
      //Key is not in tree, exit
      if (n.left === null) 
        return n;

      //Zig-Zig (i.e. left left)
      if (key < n.left.key) {
        //Recursively get node matching key
        n.left.left = splayRecursive(n.left.left, key);
        //Rotate parent around grandparent
        n = this.rotateRight(n);

      //Zig-Zag (i.e. left right)
      } else if (key > n.left.key) {
        //Recursively get node matching key
        n.left.right = splayRecursive(n.left.right, key);
        //Rotate x around current parent
        if (n.left.right !== null)
          n.left = this.rotateLeft(n.left);
      }

      //Rotate x around current parent
      if (n.left === null)
        return n;
      else 
        return this.rotateRight(n);

    //go right
    } else if (key > n.key) {
      // Key is not in tree, exit
      if (n.right === null) 
        return n;

      //Zig-Zig (i.e. right right)
      if (key > n.right.key) {
        //Recursively get node matching key
        n.right.right = splayRecursive(n.right.right, key);
        //Rotate parent around grandparent
        n = this.rotateLeft(n);

      //Zig-Zag (i.e. right left)
      } else if (key < n.right.key) {
        //Recursively get node matching key
        n.right.left = splayRecursive(n.right.left, key);
        //Rotate x around current parent
        if (n.right.left !== null)
          n.right = this.rotateRight(n.right);
      }

      //Rotate x around current parent
      if (n.right === null)
        return n;
      else 
        return this.rotateLeft(n);
    
    //key must be equal
    } else {
      return n;
    }

  }.bind(this);

  if (this.root === null || (typeof k !== "number" && typeof k !== "string")) {
    throw new Error("Invalid splay");
    return;
  }
  
  //final result of recursive calls
  //returns a tree "splayed" around new root
  this.root = splayRecursive(this.root,k);
  return;
};

//------------------------------//
// Visualization Helper Methods //
//------------------------------//

//convert tree structure into
//d3 compatible JSON
var visualJson = function(n) {
  var buildJson = function(cNode) {
    var jObj = {};
    if (cNode !== null) {
      jObj.key = cNode.key;
      jObj.val = cNode.val;
      jObj.children = [];
      if (cNode.left !== null)
        jObj.children.push(buildJson(cNode.left));
      if (cNode.right !== null)
        jObj.children.push(buildJson(cNode.right));
    }
    return jObj;
  };

  if (!(n instanceof Node))
    return null;

  return buildJson(n);
};

//
// Visualization with D3.js
//
// References:
//   https://leanpub.com/D3-Tips-and-Tricks
//
var drawTree = function(root,tree,svg,diagonal) {
  // Get nodes and links
  var nodes = tree.nodes(root).reverse();
  var links = tree.links(nodes);

  // Normalize height based on node depth
  nodes.forEach(function(d) { d.y = d.depth * 70; });

  // Declare nodes
  var node = svg.selectAll("g.node").data(nodes, function(d) { 
    return d.id || (d.id = d.key); 
  });

  // Setup node location, shape, and text
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; 
    });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", "#fff");

  nodeEnter.append("text")
    .attr("y", 18)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { 
      return d.key +' : '+ d.val; 
    })
    .style("fill-opacity", 1);

  // Declare links
  var link = svg.selectAll("path.link").data(links, function(d) { 
    return d.target.id; 
  });

  // Setup links
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);
}

var formAdd = document.getElementById("add-form");
var formRemove = document.getElementById("remove-form");
var formFind = document.getElementById("search-form");
var inorderButton = document.getElementById("inorder-button");
var minButton = document.getElementById("min-button");
var maxButton = document.getElementById("max-button");


var splayTree = new SplayBst();

//process insert form

//process delete form

//process search form

//process traversal button

//process max button

//process min button

var init = function() {

  //build tree data
  
    splayTree.insert(10,"shawn");
    splayTree.insert(4,"addison");
    splayTree.insert(12,"craig");
    splayTree.insert(19,"michael");
    splayTree.insert(1,"jennifer");
    splayTree.insert(15,"nancy");
    splayTree.insert(5,"tonya");
    splayTree.insert(21,"tiffany");
    splayTree.insert(11,"jasper");
    splayTree.insert(2,"becca");
    splayTree.insert(20,"alexa");
    splayTree.insert(16,"norah");
  

  //diagram dimensions
  var margin = {top: 20, right: 100, bottom: 20, left: 100},
    width = 960 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;

  //vector element
  var svg = d3.select("#tree-display").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //complete tree
  var tree = d3.layout.tree().size([height, width]);
  //links
  var diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y]; });

  console.log(visualJson(splayTree.root));

  drawTree(visualJson(splayTree.root),tree,svg,diagonal);

};

window.onload = init;


  // request that bypasses CORS requirements using JSONP
  var requestJSONP = function(url) {
    // create script with passed in URL
    var script = document.createElement('script');
    script.src = url;
    // after the script is loaded (and executed), remove it
    script.addEventListener("load", function(e) {
      e.target.remove();
    });
    // insert script tag into the DOM (append to <head>)
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(script, null);
  }

  //add button action
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    requestJSONP(listUrl(input.value));
  });
