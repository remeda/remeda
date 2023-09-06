import { useState } from 'react';
import type { FunctionsData } from '../scripts/transform';

export function Menu({ items }: { readonly items: FunctionsData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchTermLowered = searchTerm.toLowerCase();
  return (
    <div className="col-12 col-md-3 col-xl-2 border-r border-black/10 bg-white p-0">
      <div className="relative border-b border-black/10 !p-4">
        <input
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search..."
        />
      </div>
      <div className="h-[calc(100vh-56px-69px)] overflow-auto">
        {items
          .filter(item => item.name.toLowerCase().includes(searchTermLowered))
          .map(item => (
            <a
              href={'#' + item.name}
              key={item.name}
              className="flex items-center px-6 py-1 font-medium text-black/60 hover:bg-[#f2f3f4] hover:no-underline"
            >
              <span>{item.name}</span>
              <div className=" badge badge-success ml-auto">
                {item.category}
              </div>
              {item.methods[0].indexed && (
                <div className=" badge ml-0.5 bg-[#d49a6a] text-white">I</div>
              )}
              {item.methods[0].pipeable && (
                <div className=" badge ml-0.5 bg-[#565695] text-white">P</div>
              )}
              {item.methods[0].strict && (
                <div className=" badge ml-0.5 bg-[#f44336] text-white">S</div>
              )}
            </a>
          ))}
      </div>
    </div>
  );
}
