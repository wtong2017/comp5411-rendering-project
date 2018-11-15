# Comp5411 Rendering Project - Room decoration simulator
## Overview
We plan to implement a room decoration simulator. In this simulator, users can place different objects in the simulated room. This could help users to decorate or design the layout of their room. We would provide different layout of the room and objects such as furniture for users to choose. Different texture and material for objects could be chosen. Moveover, users could import their own images like wallpapers to be the textures of some objects like walls. Light and shading will be simulated as realistic as possible. Lastly, users could save their room to a file which could be loaded next time. Also, we will prepare some default layouts or rooms for users to choose.

## Implementation
We will build the simulator from scratch using Three.js for rendering the scene. We will implement different types of shading based on Phong shading. Also, we will implement lighting and shadow to make the scene more realistic. Users can add different light sources into the scene. For example, sunlight from outside is direct light, some light in the room is spot light, and other lights in the room can be point light. We will add shadows into the scene to make it more realistic. Shadow volume algorithm may be used here, for it is more straightforward and will produce better quality result.  To simplify the modeling process, we will download some object files (.OBJ) from web. 

We use physi.js to simulate the physics, so the object could be placed in specific location. Also users could interact with the objects in the room. With the collision detection in the physical engine, overlapping objects or objects in the air could be prevented.

At last, a saver will be implemented. All settings including the coordinates of the objects, the layout of the room and configured material parameters would be store in a txt file.

## Schedule
Week 1:
Get familiar with geometry and physics engines. Play with WebGL, three.js and physi.js. Put some objections in the scene, and try to do collision detection. In week 1, no fancy shading is needed.

Week 2:
Start to write shading part. Starting from some simple shading algorithms like phong shading. Change shading algorithms to see their differences. Finally, all objects are expected to look nature. And we may consider performance here. We need to find a balance point between quality of shading and rendering time.

Week 3:
In week 3, we will try to add lighting and shadowing elements into the project. Users can add light sources into the scene. 
