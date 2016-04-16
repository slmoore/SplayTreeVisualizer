/*
JavaScript Splay Tree

Description:
  A Splay Tree is a tree that rotates recently accessed nodes to the root.  
  The root rotation process is known as "splaying".

Purpose:
  Popular nodes will be quicker and more efficiently accessed.  
  If a tree contains many nodes however only a small percentage are regularly used, 
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
  algs4.cs.princeton.edu/33balanced/SplayBST.java
*/

//Modify null checks to instead use a more general sense of "undefined"
//find the best methodology to mimic something like empty() in php

//Node Object Constructor
function Node(key,val) {
  this.key = key;
  this.val = val;
  this.left = null;
  this.right = null;
}

//Binary Search Tree Constructor
function splayBst() {
  this.root = null;
}

//Get Node from Tree
//
//retrieves a node
//traverses tree recursively from root
//based on key
splayBst.prototype.search = function(k) {
  var searchRecursive = function(cNode, key) {
    if (cNode === null) 
      return null;

    if (key < cNode.key)
      return searchRecursive(cNode.left,key);
    else if (key > cNode.key) 
      return searchRecursive(cNode.right,key);
    
    return cNode;
  };

  if (this.root === null || k === null)
    return null;

  return searchRecursive(this.root,k);
};

//Put Node on Tree
//
//adds node to the correct location on tree;
//traverses tree recursively from root
//based on key
splayBst.prototype.insert = function(k,v) {
  var insertRecursive = function(cNode, key, val) {
    //return a new node when current node is null
    //this is what generates the inserted node
    //it is then placed as a left or right link
    //using the recursive calls below
    if (cNode === null) {
      return new Node(key, val);
    }
    
    //recursive calls below continue until a null link is reached
    //
    //if the child of current node is null
    //  then the recursive call will return a new node 
    //  and assign it to the child completing the insertion
    //if the child is not null
    //  then the recursive call will continue

    //traverse left if new key is less
    if (key < cNode.key) {
      cNode.left = insertRecursive(cNode.left,key,val);

    //traverse right if new key is greater
    } else if (key > cNode.key) {
      cNode.right = insertRecursive(cNode.right,key,val);
    
    //else the new key is not less or greater, so it already exists 
    //replace the value
    } else {
      cNode.val = val;
    }
    
    //linking or replacing is finished
    //return current node off the recursion stack
    return cNode;
  };

  //handle null root
  if (this.root === null) {
    if (k === null || v === null) {
      return null;
    } else {
      this.root = new Node(k,v);
      return this.root;
    }
  }

  //begin at root
  return insertRecursive(this.root,k,v);
};

// * Removal Only Reassigns left and right links for the tree *
// * Garbage collector takes the node once it is disconnected *
//
// Removal Handles 3 Scenarios:
//
// 1. node has no children, assign parent's link to the removal node to null and the node itself to null
// 2. node has one child, node's child is assigned to the parent link, node is assigned to null
// 3. node has two children, replace node with it's successor:
//    - find min child from it's right subtree (min(node.right); i.e. successor)
//    - replace removal node's data (key,val) with min child data (they are now duplicates)
//    - remove the min child node (assign it to null)
splayBst.prototype.remove = function(k) {
  var removeRecursive = function(cNode, key) {
    var temp;
    if (cNode === null) 
      return null;

    //as recursive stack returns 
    //each node is assigned back
    //to the parent links (left or right)

    //go left
    if (key < cNode.key) {
      cNode.left  = removeRecursive(cNode.left, key);
    //go right
    } else if (key > cNode.key) {
      cNode.right = removeRecursive(cNode.right, key);
    //key matches, begin link reassignment
    } else { 
        //no children
        if (cNode.left === null && cNode.right === null) {
          return null;
        }
        //one child
        if (cNode.right === null) {
          return cNode.left;
        }
        if (cNode.left === null) {
          return cNode.right;
        }
        //two children
        //find successor (min of right subtree)
        temp = this.min(cNode.right);
        //replace values with successor
        cNode.key = temp.key;
        cNode.val = temp.val;
        //remove successor links from right subtree
        //and reassign right link
        cNode.right = removeRecursive(cNode.right,temp.key);
    }
    //returns completed node
    //to a recursive call or 
    //it's the final tree root
    return cNode;
  }.bind(this);

  if (this.root === null || k === null)
    return null;
  
  //final result of recursive calls a tree
  //without any link to the removed node
  this.root = removeRecursive(this.root,k);
};

//Get the Minimum Node
//
//key based
splayBst.prototype.min = function(n) {
  var current;
  var minRecursive = function(cNode) {
    if (cNode.left) {
      return minRecursive(cNode.left);
    }
    return cNode;
  };

  if (this.root === null)
    return null;

  if (n)
    current = n;
  else
    current = this.root;

  return minRecursive(current);
};

//Get the Maximum Node
//
//key based
splayBst.prototype.max = function(n) {
  var current;
  var maxRecursive = function(cNode) {
    if (cNode.right) {
      return maxRecursive(cNode.right);
    }
    return cNode;
  };

  if (this.root === null)
    return null;

  if (n)
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
splayBst.prototype.inOrder = function(cNode,nodeArray) {
  if (!Array.isArray(nodeArray)) {
    throw new Error("inOrder requires array");
  }

  if(cNode) {
    this.inOrder(cNode.left,nodeArray);
    nodeArray.push(cNode);
    this.inOrder(cNode.right,nodeArray);
  }
};

//Rotate node to the right
//(becomes right child of its left child)
splayBst.prototype.rotateRight = function(cNode) {
  var temp;
  if (cNode) {
    temp = cNode.left;
    cNode.left = temp.right;
    temp.right = cNode;
  }
  return temp;
}

//Rotate node to the left
//(becomes left child of its right child)
splayBst.prototype.rotateLeft = function(cNode) {
  var temp;
  if (cNode) {
    temp = cNode.right;
    cNode.right = temp.left;
    temp.left = cNode;
  }
  return temp;
}

//Splaying:
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
// http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf
//
// Code below is a modification of original Java splaying code by:
//   Josh Israel
//   http://algs4.cs.princeton.edu/33balanced/SplayBST.java
splayBst.prototype.splay = function(k) {
  var splayRecursive = function(cNode, key) {
    //if empty return
    if (cNode === null)
      return null;

    //go left
    if (key < cNode.key) {
      //Key is not in tree, exit
      if (cNode.left === null) 
        return cNode;

      //Zig-Zig (i.e. left left)
      if (key < cNode.left.key) {
        //Recursively get node matching key
        cNode.left.left = splayRecursive(cNode.left.left, key);
        //Rotate parent around grandparent
        cNode = this.rotateRight(cNode);

      //Zig-Zag (i.e. left right)
      } else if (key > cNode.left.key) {
        //Recursively get node matching key
        cNode.left.right = splayRecursive(cNode.left.right, key);
        //Rotate x around current parent
        if (cNode.left.right !== null)
          cNode.left = this.rotateLeft(cNode.left);
      }

      //Rotate x around current parent
      if (cNode.left === null)
        return cNode;
      else 
        return this.rotateRight(cNode);

    //go right
    } else if (key > cNode.key) {
      // Key is not in tree, exit
      if (cNode.right === null) 
        return cNode;

      //Zig-Zig (i.e. right right)
      if (key > cNode.right.key) {
        //Recursively get node matching key
        cNode.right.right = splayRecursive(cNode.right.right, key);
        //Rotate parent around grandparent
        cNode = this.rotateLeft(cNode);

      //Zig-Zag (i.e. right left)
      } else if (key < cNode.right.key) {
        //Recursively get node matching key
        cNode.right.left = splayRecursive(cNode.right.left, key);
        //Rotate x around current parent
        if (cNode.right.left !== null)
          cNode.right = this.rotateRight(cNode.right);
      }

      //Rotate x around current parent
      if (cNode.right === null)
        return cNode;
      else 
        return this.rotateLeft(cNode);
    
    //key must be equal
    } else {
      return cNode;
    }

  }.bind(this);

  if (this.root === null || k === null)
    return null;
  
  //final result of recursive calls
  //tree "splayed" around new root
  this.root = splayRecursive(this.root,k);
  return this.root;
}




window.onload = function() {
  var nodes = [];
  //setup
  var tree = new splayBst();
  tree.insert(10,"shawn");
  tree.insert(4,"addison");
  tree.insert(12,"craig");
  tree.insert(19,"michael");
  tree.insert(1,"jennifer");
  tree.insert(15,"nancy");
  tree.insert(5,"tonya");
  tree.insert(21,"tiffany");
  tree.insert(11,"jasper");
  tree.insert(2,"becca");
  tree.insert(20,"alexa");


  console.log("splay 19");
  tree.splay(19);
  tree.inOrder(tree.root,nodes);
  console.log(nodes);
  console.log(tree.root);

};

