# SplayTreeVisualizer
Visualization of Splay Tree Operations

<p>My Splay Tree Visualizer is a tool to visualize the operations performed by a Splay Tree.  The idea is inspired by the algorithm visualizations found at <a href="http://visualgo.net/" target="_blank">visualgo.net</a>.  I have always found their presentations of algorithms and data structures to be helpful and hopefully my visualization of Splay Trees will be helpful as well.</p>

  <p>My Splay Tree implementation is done purely in JavaScript and is modeled after a Java implementation done by Josh Israel and a Binary Search Tree implementation done by Robert Sedgewick.  The visualization is done with standard HTML, CSS, and JavaScript along with the Bootstrap CSS framework and D3.js data modeling library.  Bootstrap was helpful in making the display uniform using their grid system and as responsive as possible.  D3.js helps with the display process of turning the Tree data structure into connected SVG elements (scalable vector graphics).</p>

  <h4>References:</h4>
  <ul>
  <li><a href="http://algs4.cs.princeton.edu/32bst/" target="_blank">http://algs4.cs.princeton.edu/32bst/</a></li>
  <li><a href="http://algs4.cs.princeton.edu/33balanced/" target="_blank">http://algs4.cs.princeton.edu/33balanced/</a></li>
  <li><a href="http://getbootstrap.com/" target="_blank">http://getbootstrap.com/</a></li>
  <li><a href="https://d3js.org/" target="_blank">https://d3js.org/</a></li>
  <li><a href="https://leanpub.com/D3-Tips-and-Tricks" target="_blank">https://leanpub.com/D3-Tips-and-Tricks</a></li>
  <li><a href="http://visualgo.net/" target="_blank">http://visualgo.net/</a></li>
  </ul>

  <p>Below is a description of how to use the visualizer and for more information on Splay Trees in general continue to the bottom.</p>

  <h4>Add/Update</h4>

  <p>Under "Add/Update" type a number into the Key field and a word into the Value field, then click the add button.  Repeat these steps multiple times to see how the tree reacts.  Every insert "splays" the tree based on the new value and then assigns the new value as the root.  Every tree node will have a left child node and right child node which may be empty depending on the current tree order.  You can update existing nodes by typing in an existing key with a different value.  This will change the value and rotate the node to the root.</p>

  <h4>Remove</h4>

  <p>After nodes have been added to the tree you can remove them.  Under the "Remove" section, type an existing node key into the key field and click the remove button.  The maximum key that is less than the removed key will now be the root.  If a key chosen for removal does not exist, the tree will splay around the closest value to that key.</p>

  <h4>Find</h4>

  <p>Under "Find" type a key and click the Find button.  The tree will splay the key to the root if it exists.  If it does not exist the successor node (minimum node from the right subtree) will be the new root.</p>

  <h4>Max</h4>

  <p>On the bottom of the screen click the "Max" button.  This will Highlight in orange the node with the greatest key value.  It will last 2 seconds.  This operation does not splay the tree.</p>

  <h4>Min</h4>

  <p>On the bottom of the screen click the "Min" button.  This will Highlight in red the node with the smallest key value.  It will last 2 seconds.  This operation does not splay the tree.</p>

  <h4>System Requirements</h4>

  <p>Use a modern browser, preferably Chrome or Firefox.  If using Internet Explorer, please use version 10 or higher.</p>

  <p>Use a device with a large screen size (desktop, laptop, most tablets).  The tree elements created as an SVG (scalable vector graphic) are not responsive to screen dimensions, so they may be difficult to see on smaller screens.</p>
  
  <h3 id="info-title-what">What is a Splay Tree?</h3>

  <p>
  A splay tree is a self-adjusting binary search tree (BST).  It allows for quicker access of data when the access pattern is non-uniform.  When searching for a node, tree rotations are performed until the closest matching node is located at the root.  This is called "splaying".  This means regularly accessed nodes will be located near the root of the tree.  When a program is often accessing the same nodes then splay tree operations are often faster than other search trees.
  </p>

  <p>
  The amortized runtime for splay tree operations (insert, delete, search) is O(log n), which is equal to other self-balancing BSTs.  The narrower the access pattern, the faster the splay tree will be.  A disadvantage is the worst case runtime of O(n).  This happens if the splay tree becomes linear and the height of the tree is accessed.  However, this is a rare occurrence and over time the runtime maintains O(log n).
  </p>

  <p>
  A good example for using a splay tree is when accessing Facebook friends.  A user may have hundreds or thousands of Facebook friends, but on average will only routinely visit a dozen of those friends.  Other useful applications for the splay tree is in caching and garbage collection.
  </p>

  <p>
  Splay Trees were invented by Daniel Dominic Sleator and Robert Endre Tarjan in 1985.  All basic BST operations (insert, delete, search) include the "splaying" operation.  Splaying rotates a tree based on a few scenarios.  Let N be the node selected by an insert, delete, or search operation, let P be the parent node, and let G be the grandparent node.  If N is the root node, then exit the splaying operation.  Otherwise, if there is no G, then rotate N around P.  If there is a G, then perform one of two possible operations based on where the G and P are located.  If N is a left child and P is a left child or if N is a right child and P is a right child, then rotate N around P.  This is called a "Zig-Zig".  If N is a left child and P is a right child or if N is a right child and P is a left child (i.e. opposite child types), then rotate N around P and then rotate N around the former G.  This is called a "Zig-Zag".  Rotations continue until N is at the root.
  </p>

  <p>
  These rules are repeated for the insert, delete, and search operations to get the selected node or the closest available to the root.  The search operation calls the splay and then if the root matches the search key, then it will return the root.  The insert operation calls the splay and if the new node is different from the root, it assigns the new node to the root and joins the former root to it.  If the insert is a duplicate, then different implementations will handle duplicates differently.  If duplicates are not allowed, then the insert can also be used as an update operation.  The delete operation calls the splay and if the root matches then remove its links so that the left and right children are now different trees or "split".  Splay the left subtree around its max (so that the left subtree root's right child is empty) and then "join" the right subtree with it as the right child.
  </p>

  <p>
  Splay trees are a great option for storing a collection of data where only a small percentage of the nodes are regularly accessed.  While it does not always have a worst case runtime of O(log n) it will have a better runtime than other BSTs when the selected node was already recently selected.
  </p>

  <p>
    <h4>References:</h4>
    <ul>
      <li><a href="https://en.wikipedia.org/wiki/Splay_tree" target="_blank">https://en.wikipedia.org/wiki/Splay_tree</a></li>
      <li><a href="http://www.cs.cmu.edu/~sleator/papers/self-adjusting.pdf" target="_blank">http://www.cs.cmu.edu/~sleator/papers/self-adjusting.pdf</a></li>
      <li><a href="http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf" target="_blank">http://cs.brynmawr.edu/Courses/cs206/fall2012/slides/09_SplayTrees.pdf</a></li>
      <li><a href="http://courses.cs.washington.edu/courses/cse326/01au/lectures/SplayTrees.ppt" target="_blank">http://courses.cs.washington.edu/courses/cse326/01au/lectures/SplayTrees.ppt</a></li>
    </ul>
  </p>
