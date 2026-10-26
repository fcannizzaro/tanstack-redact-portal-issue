import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Menu } from "@base-ui/react/menu";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
  useRouterState,
} from "@tanstack/react-router";
import "./style.css";

function log(message) {
  document.getElementById("events").textContent += `${message}\n`;
}

function App() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <main>
      <h1>Portalled submenu link</h1>
      <p>Runtime: <strong>{__RUNTIME__}</strong> | Current route: <code>{pathname}</code></p>
      <p>Open More → Pages, hover Example page, then click its text.</p>
      <Menu.Root
        open={open}
        onOpenChange={(nextOpen, details) => {
          log(`Menu ${nextOpen ? "opened" : "closed"}: ${details.reason} (${details.event.type})`);
          setOpen(nextOpen);
        }}
      >
        <Menu.Trigger>More</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup className="popup">
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger className="item">Pages →</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={4}>
                    <Menu.Popup className="popup">
                      <Menu.Item
                        className="item"
                        render={<Link to="/example" />}
                        onClick={() => {
                          log("Link received click");
                          setOpen(false);
                        }}
                      >
                        <span>Example page</span>
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.SubmenuRoot>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Outlet />
      <p><Link to="/">Home</Link> · <Link to="/example">Direct link outside menu</Link></p>
    </main>
  );
}

const rootRoute = createRootRoute({ component: App });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <h2>Home page</h2>,
});
const exampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/example",
  loader: async () => {
    log("Loading /example: fetching /example.json");
    const response = await fetch("/example.json");
    return response.json();
  },
  component: () => <h2>Example page: navigation succeeded</h2>,
});
const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, exampleRoute]),
  defaultPreload: "intent",
});
router.subscribe("onBeforeNavigate", ({ toLocation }) => log(`Navigating to ${toLocation.pathname}`));

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
