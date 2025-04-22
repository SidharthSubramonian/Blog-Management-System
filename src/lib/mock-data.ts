
import { Blog, Comment, User, Tag, BlogStats } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Tech enthusiast and blogger.',
    createdAt: new Date(2023, 0, 15),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Writer and UX designer.',
    createdAt: new Date(2023, 1, 20),
  },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'Technology', slug: 'technology', blogCount: 15 },
  { id: '2', name: 'Programming', slug: 'programming', blogCount: 10 },
  { id: '3', name: 'Design', slug: 'design', blogCount: 8 },
  { id: '4', name: 'Health', slug: 'health', blogCount: 5 },
  { id: '5', name: 'Travel', slug: 'travel', blogCount: 7 },
  { id: '6', name: 'Food', slug: 'food', blogCount: 4 },
];

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React in 2023',
    content: `
    # Getting Started with React in 2023

    React has evolved significantly since its initial release. In this comprehensive guide, we'll explore the best practices, tools, and approaches for starting with React in 2023.

    ## Setting Up Your Development Environment

    Before diving into React, it's important to set up a robust development environment. Here's what you'll need:

    1. **Node.js and npm**: The foundation of any React project.
    2. **Code Editor**: VS Code, WebStorm, or any editor with good React support.
    3. **Git**: For version control.

    ## Creating Your First React Application

    The easiest way to start a new React project is by using Create React App:

    \`\`\`bash
    npx create-react-app my-app
    cd my-app
    npm start
    \`\`\`

    This sets up a new React project with a good default configuration.

    ## Modern React Features to Learn

    React has introduced several features that have changed how we write React applications:

    1. **Hooks**: Functions that let you use state and other React features without writing a class.
    2. **Context API**: For managing global state across your application.
    3. **Concurrent Mode**: For better user experience with smoother transitions.

    ## Building Your First Component

    Let's create a simple React component:

    \`\`\`jsx
    function Greeting({ name }) {
      return <h1>Hello, {name}!</h1>;
    }

    export default Greeting;
    \`\`\`

    ## Conclusion

    Starting with React in 2023 is easier than ever, thanks to the robust ecosystem and helpful community. Happy coding!
    `,
    excerpt: 'Learn the fundamentals of React development in 2023 with this comprehensive guide for beginners.',
    slug: 'getting-started-with-react-2023',
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    publishedAt: new Date(2023, 3, 10),
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 10),
    authorId: '1',
    author: mockUsers[0],
    tags: ['React', 'JavaScript', 'Web Development'],
    commentCount: 8,
    viewCount: 420,
    featured: true,
    isOriginal: true,
    isPending: false,
  },
  {
    id: '2',
    title: 'Mastering CSS Grid Layout',
    content: `
    # Mastering CSS Grid Layout

    CSS Grid Layout is a powerful tool that has revolutionized web layout design. In this guide, we'll explore how to effectively use CSS Grid to create complex, responsive layouts with ease.

    ## What is CSS Grid?

    CSS Grid Layout is a two-dimensional layout system designed specifically for the web. It allows you to layout content in rows and columns, and has many features that make creating complex layouts straightforward.

    ## Basic Grid Terminology

    Before diving into code examples, let's understand some basic terminology:

    - **Grid Container**: The element on which \`display: grid\` is applied.
    - **Grid Item**: The children of the grid container.
    - **Grid Line**: The dividing lines that make up the structure of the grid.
    - **Grid Track**: The space between two adjacent grid lines (rows or columns).
    - **Grid Cell**: The space between four grid lines (a single "cell" of the grid).
    - **Grid Area**: A rectangular space surrounded by four grid lines.

    ## Creating Your First Grid

    Here's how to create a simple grid with three columns and two rows:

    \`\`\`css
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 100px 200px;
      gap: 20px;
    }
    \`\`\`

    ## Placing Items on the Grid

    Grid items can be placed specifically using grid lines:

    \`\`\`css
    .item1 {
      grid-column: 1 / 3;  /* From line 1 to line 3 (spanning 2 columns) */
      grid-row: 1 / 2;     /* From line 1 to line 2 (spanning 1 row) */
    }
    \`\`\`

    ## Creating Responsive Layouts with Grid

    CSS Grid makes creating responsive layouts simpler with functions like \`minmax()\` and \`repeat()\`:

    \`\`\`css
    .responsive-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    \`\`\`

    This creates a grid where columns are at least 250px wide, and as many columns as can fit will be created.

    ## Conclusion

    CSS Grid is an incredibly powerful layout tool that, when combined with CSS Flexbox, gives web developers unprecedented control over page layout.
    `,
    excerpt: 'Discover how to use CSS Grid Layout to create complex, responsive web layouts with this in-depth tutorial.',
    slug: 'mastering-css-grid-layout',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    publishedAt: new Date(2023, 4, 5),
    createdAt: new Date(2023, 4, 1),
    updatedAt: new Date(2023, 4, 5),
    authorId: '2',
    author: mockUsers[1],
    tags: ['CSS', 'Web Design', 'Layout'],
    commentCount: 5,
    viewCount: 310,
    featured: false,
    isOriginal: true,
    isPending: false,
  },
  {
    id: '3',
    title: 'Introduction to TypeScript',
    content: `
    # Introduction to TypeScript

    TypeScript is a strongly typed programming language that builds on JavaScript. In this guide, we'll explore the basics of TypeScript and how it can improve your development workflow.

    ## What is TypeScript?

    TypeScript is a superset of JavaScript that adds static typing and other features to the language. It was developed by Microsoft and is designed to make large-scale JavaScript applications more maintainable.

    ## Why Use TypeScript?

    There are several benefits to using TypeScript:

    1. **Type Safety**: Catch errors during development rather than at runtime.
    2. **Better IDE Support**: Get better autocompletion, navigation, and refactoring tools.
    3. **Enhanced Readability**: Types serve as documentation for your code.
    4. **Easier Refactoring**: Make changes to your codebase with confidence.

    ## Getting Started with TypeScript

    First, you'll need to install TypeScript:

    \`\`\`bash
    npm install -g typescript
    \`\`\`

    Next, create a simple TypeScript file (\`hello.ts\`):

    \`\`\`typescript
    function greet(name: string): string {
      return \`Hello, \${name}!\`;
    }

    console.log(greet("TypeScript"));
    \`\`\`

    Compile it to JavaScript:

    \`\`\`bash
    tsc hello.ts
    \`\`\`

    This will generate a \`hello.js\` file that you can run with Node.js.

    ## Basic TypeScript Types

    TypeScript supports several basic types:

    \`\`\`typescript
    // Boolean
    let isDone: boolean = false;

    // Number
    let decimal: number = 6;

    // String
    let color: string = "blue";

    // Array
    let list: number[] = [1, 2, 3];
    let anotherList: Array<number> = [1, 2, 3];

    // Tuple
    let x: [string, number] = ["hello", 10];

    // Enum
    enum Color {Red, Green, Blue}
    let c: Color = Color.Green;

    // Any
    let notSure: any = 4;
    notSure = "maybe a string";
    notSure = false;

    // Void
    function warnUser(): void {
      console.log("This is a warning message");
    }

    // Null and Undefined
    let u: undefined = undefined;
    let n: null = null;

    // Object
    let obj: object = {};
    \`\`\`

    ## Interfaces in TypeScript

    Interfaces define the shape of an object:

    \`\`\`typescript
    interface User {
      id: number;
      name: string;
      email: string;
      age?: number; // Optional property
    }

    function createUser(user: User): User {
      return user;
    }

    const newUser = createUser({
      id: 1,
      name: "John Doe",
      email: "john@example.com"
    });
    \`\`\`

    ## Conclusion

    TypeScript is a powerful tool for building robust JavaScript applications. By leveraging its type system, you can catch errors early, write more maintainable code, and improve your development experience.
    `,
    excerpt: 'Learn the fundamentals of TypeScript and how it can improve your JavaScript development experience.',
    slug: 'introduction-to-typescript',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    publishedAt: new Date(2023, 5, 15),
    createdAt: new Date(2023, 5, 10),
    updatedAt: new Date(2023, 5, 15),
    authorId: '1',
    author: mockUsers[0],
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    commentCount: 3,
    viewCount: 250,
    featured: false,
    isOriginal: true,
    isPending: false,
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This was a really helpful guide! I\'ve been trying to learn React for a while now.',
    blogId: '1',
    authorId: '2',
    author: mockUsers[1],
    createdAt: new Date(2023, 3, 11),
    updatedAt: new Date(2023, 3, 11),
  },
  {
    id: '2',
    content: 'Great article! I especially liked the section on hooks.',
    blogId: '1',
    authorId: '1',
    author: mockUsers[0],
    createdAt: new Date(2023, 3, 12),
    updatedAt: new Date(2023, 3, 12),
  },
  {
    id: '3',
    content: 'CSS Grid is amazing. This article explained it really well!',
    blogId: '2',
    authorId: '1',
    author: mockUsers[0],
    createdAt: new Date(2023, 4, 6),
    updatedAt: new Date(2023, 4, 6),
  }
];

export const mockBlogStats: BlogStats = {
  totalBlogs: 5,
  totalViews: 1200,
  totalComments: 18,
  publishedBlogs: 3,
  draftBlogs: 1,
  pendingBlogs: 1,
};

// Mock function to get comments for a specific blog
export const getCommentsForBlog = (blogId: string): Comment[] => {
  return mockComments.filter(comment => comment.blogId === blogId);
};

// Mock function to get a blog by ID
export const getBlogById = (id: string): Blog | undefined => {
  return mockBlogs.find(blog => blog.id === id);
};

// Mock function to get a blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return mockBlogs.find(blog => blog.slug === slug);
};
