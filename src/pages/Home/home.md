# This site is fast

#### Very fast

It's built using an experimental code splitting and navigation layer on top of Hyperapp 2.0.

It is meant to be deployed on static hosting services like Netlify or Github Pages, which are often free, efficient, highly scalable and a lot more.

Pages are bundled individually and loaded asynchronously at the right time using a very smart `<Link>` component. They all still share the same global state and Hyperapp instance.



Here are the pieces:


## Pages 
Pages are Hyperapp components (pure view functions) that receive the state.

They are bundled in their own file using parcel's [dynamic imports](https://parceljs.org/code_splitting.html). 

The bundles are loaded in the background when links pointing to them enter the viewport, or when a user hovers on their corresponding links.


If they need dynamic runtime data, they get it from the state as usual.

Pages can export a `Init` Hyperapp Action which gets triggered when the page's bundle has been downloaded. Not to confuse with an `OnNavigation` action which would be triggered when a page apprears on screen.

This `Init` Action can be used to setup the state in advance for the page or load data ahead of time via side-effects.



## Routing

To route your app, you list all your route patterns in a `routes.js` file, and map these routes to your page components.

This is the routing for this site:

```
export default {
  '/': import('./pages/Home'),
  '/project': import('./pages/Project'),
  '/architecture': import('./pages/Architecture'),
  '/hurdles': import('./pages/Hurdles'),
  '/rickandmorty': import('./pages/RickAndMorty'),
  '/pokemons': import('./pages/Pokemons'),
  '/pokemons/:id': import('./pages/Pokemon')
}
```

You need to use the `import(...)` statement for each route to indicate parcel to bundle the file in it's own bundle.

The routes are actually loaded into the state, which allows the application to be aware of the status of each route. This is also necessary for many of the `Link` component's functionnalities.


## Link

The `<Link>` component works just like your typical Hyperapp / React / Gatsby `<Link>` component. Use use them like this:

`<Link to="/my-awesome-page>My awesome page!</Link>`  
or  
`<Link to="/products/-some-slug/7839>My awesome page!</Link>`  

**Except they do more stuff under the hood.**

Here is what is going on in the background.

Each link is aware of the page bundle it points to. Links have 4 statuses: 

- **Invalid route**:
  The link has no matching route. The link knows it will 404. The link will still work, but will not be doing anything in the background.
- **Iddle**:
  The link is valid and waits to enter the viewport or to be hovered on.
- **Loading**:
  The page bundle matching the link is being downloaded. This was triggered because this link, or another link pointing to the same bundle has entered the viewport, been hovered on or has been clicked.
- **Loaded**:
  The matching route is ready to be viewed
- **Active**:
  The route has been activated, the matching page is being viewed.

For this technical demo, the statuses for each link is being shown with an icon, but usually, this would all be transparent to the user.



## Pre-rendering 

Pre-rendering the site is actually optionnal. The entire site will still work perfectly without it, but doing it still has some nice benefits. 

Even if Hyperapp's tiny size and quick rendering brings your TTI to a negligable number, there will always be users with a very slow network connection and low-end device who will benefit from this. 

There also SEO benefits to this.

To render your static routes, run this command:

```
npm run render-pages
```

If you have dynamic routes that you want to render, you need to give an array of all these URLs to the generator.

You can do this dynamically by adding javascript to the `createPages.js` file.

All pages for this demo site has been pre-rendered. Try disabling javascript in your browser, everything should still mostly work!