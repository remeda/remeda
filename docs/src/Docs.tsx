import * as React from 'react';
const exampleData = require('./data.json');
import { Menu } from './Menu';
import { FnDoc } from './FnDoc';

export function Docs() {
  return (
    <div className="container-fluid">
      <div className="row flex-xl-nowrap">
        <Menu items={exampleData} />
        <div className="col-12 col-md-9 col-xl-10 py-md-3 main-content">
          {exampleData.map((data: any) => <FnDoc {...data} key={data.name} />)}
        </div>
      </div>
    </div>
  );
}
