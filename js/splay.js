/*
Splay Tree

Description:
A Splay Tree is a tree that moves recently access nodes to the root
using a process of tree rotations.  The process overall is known as "splaying".

Purpose:
Popular nodes will be quicker and more efficiently accessed.  If a tree contains
thousands of nodes however only 10% of those are regularly used, then it is
more efficient to keep them closer to the root.

author: 
  Shawn Moore

Methods:
  search
  insert
  remove
  min
  max
  inOrder
  splay

Node properties:
  key
  val
  left
  right

Splaying:
  To “splay node x”, traverse up the tree from
  node x to root, rotating along the way until x
  is the root.

  x === chosen node

  For each rotation:
    1. If x is the root, do nothing.
       
    2. "Zig": If x has no grandparent, rotate x about its parent.
    3. If x has a grandparent:
      a. "Zig-Zig": if x and its parent are both left children or both right
         children, rotate the parent about the grandparent, then
         rotate x about its parent.
      b. "Zig-Zag": if x and its parent are opposite type children (one left
         and the other right), rotate x about its parent, then rotate
         x about its new parent (former grandparent).

Reference:
http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf

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
function Bst() {
  this.root = null;
}

//Get Node from Tree
//
//retrieves a node
//traverses tree recursively from root
//based on key
Bst.prototype.search = function(k) {
  var current;
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

  current = this.root;
  return searchRecursive(current,k);
};

//Put Node on Tree
//
//adds node to the correct location on tree;
//traverses tree recursively from root
//based on key
Bst.prototype.insert = function(k,v) {
  var current;
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
  current = this.root;
  return insertRecursive(current,k,v);
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
Bst.prototype.remove = function(k) {
  var current;
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
Bst.prototype.min = function(n) {
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
Bst.prototype.max = function(n) {
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
Bst.prototype.inOrder = function(cNode,nodeArray) {
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
Bst.prototype.rotateRight = function(cNode) {
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
Bst.prototype.rotateLeft = function(cNode) {
  var temp;
  if (cNode) {
    temp = cNode.right;
    cNode.right = temp.left;
    temp.left = cNode;
  }
  return temp;
}


//CONVERT THE C SPLAY BELOW INTO A JS SPLAY

// This function brings the key at root if key is present in tree.
// If key is not present, then it brings the last accessed item at
// root.  This function modifies the tree and returns the new root
struct node *splay(struct node *root, int key)
{
    // Base cases: root is NULL or key is present at root
    if (root == NULL || root->key == key)
        return root;
 
    // Key lies in left subtree
    if (root->key > key)
    {
        // Key is not in tree, we are done
        if (root->left == NULL) return root;
 
        // Zig-Zig (Left Left)
        if (root->left->key > key)
        {
            // First recursively bring the key as root of left-left
            root->left->left = splay(root->left->left, key);
 
            // Do first rotation for root, second rotation is done after else
            root = rightRotate(root);
        }
        else if (root->left->key < key) // Zig-Zag (Left Right)
        {
            // First recursively bring the key as root of left-right
            root->left->right = splay(root->left->right, key);
 
            // Do first rotation for root->left
            if (root->left->right != NULL)
                root->left = leftRotate(root->left);
        }
 
        // Do second rotation for root
        return (root->left == NULL)? root: rightRotate(root);
    }
    else // Key lies in right subtree
    {
        // Key is not in tree, we are done
        if (root->right == NULL) return root;
 
        // Zag-Zig (Right Left)
        if (root->right->key > key)
        {
            // Bring the key as root of right-left
            root->right->left = splay(root->right->left, key);
 
            // Do first rotation for root->right
            if (root->right->left != NULL)
                root->right = rightRotate(root->right);
        }
        else if (root->right->key < key)// Zag-Zag (Right Right)
        {
            // Bring the key as root of right-right and do first rotation
            root->right->right = splay(root->right->right, key);
            root = leftRotate(root);
        }
 
        // Do second rotation for root
        return (root->right == NULL)? root: leftRotate(root);
    }
}



window.onload = function() {
  var nodes = [];
  //setup
  var tree = new Bst();
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


  console.log("remove 19");
  tree.remove(19);
  tree.inOrder(tree.root,nodes);
  console.log("after");
  console.log(nodes);

  console.log(tree.search(19));
  console.log(tree.search(50));


};

