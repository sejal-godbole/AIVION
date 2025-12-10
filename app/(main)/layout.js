const MainLayout = ({children}) => {
// Redirect user after checking if they are onboarded
    return (
        <div className="container mx-auto mt-20 mb-20">{children}</div>
    )
}

export default MainLayout


// In next js routes are difined by the folder structure.
// Each folder must contain a page.js file so that it can be accessible as a public route.
// The layout.js file is used to define a layout that will be shared across all the pages in that folder.

// Types of Routes:
// 1. Nested Routes: You can create nested routes by creating subfolders within a folder. Each subfolder can have its own page.js and layout.js files.
// 2. Dynamic Routes: You can create dynamic routes by using square brackets in the folder name. For example, a folder named [id] will match any route with a dynamic segment.
// 3. Catch All Routes: You can create catch-all routes by using double square brackets in the folder name. For example, a folder named [[...slug]] will match any route with zero or more segments.

// Special Folders:
// 1. (main): This folder is used to group routes that share a common layout or functionality. It is not part of the URL structure.
// 2. Private Folders: You can create private folders by prefixing the folder name with an underscore (_). These folders will not be accessible as public routes.

