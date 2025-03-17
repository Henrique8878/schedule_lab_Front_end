import { Link, LinkProps, useLocation } from 'react-router-dom'

type Linkprops = LinkProps
export function NavLink(props:Linkprops) {
  const { pathname } = useLocation()
  return (
    <Link
      {...props} data-current={pathname === props.to}
      className="flex gap-2 font-medium text-muted-foreground
      data-[current=true]:text-foreground"
    />
  )
}
