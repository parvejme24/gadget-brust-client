// re-mounts on every navigation, so each dashboard page eases in under the fixed shell
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
