import * as React from 'react';

export interface MenuProps {
  items: Array<{
    name: string;
    category: string;
    methods: any[];
  }>;
}

export class Menu extends React.PureComponent<
  MenuProps,
  { searchTerm: string }
> {
  state = {
    searchTerm: '',
  };

  render() {
    const { items } = this.props;
    const { searchTerm } = this.state;
    const searchTermLowered = searchTerm.toLowerCase();
    return (
      <div className="col-12 col-md-3 col-xl-2 sidebar bg-white">
        <div className="menu-search">
          <input
            type="search"
            value={searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
            className="form-control"
            placeholder="Search..."
          />
        </div>
        <div className="fn-scroll">
          {items
            .filter(item => item.name.indexOf(searchTermLowered) !== -1)
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
              </a>
            ))}
        </div>
      </div>
    );
  }
}
