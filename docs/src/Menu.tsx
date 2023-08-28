import { useState } from 'react';

export interface MenuProps {
  items: Array<{
    name: string;
    category: string;
    methods: Array<any>;
  }>;
}

export function Menu({ items }: MenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchTermLowered = searchTerm.toLowerCase();
  return (
    <div className="col-12 col-md-3 col-xl-2 sidebar bg-white">
      <div className="menu-search">
        <input
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search..."
        />
      </div>
      <div className="fn-scroll">
        {items
          .filter(item => item.name.toLowerCase().includes(searchTermLowered))
          .map(item => (
            <a href={'#' + item.name} key={item.name} className="menu-link">
              <span>{item.name}</span>
              <div className=" badge badge-success">{item.category}</div>
              {item.methods[0].indexed && (
                <div className=" badge indexed-color">I</div>
              )}
              {item.methods[0].pipeable && (
                <div className=" badge pipeable-color ">P</div>
              )}
              {item.methods[0].strict && (
                <div className=" badge strict-color ">S</div>
              )}
            </a>
          ))}
      </div>
    </div>
  );
}
