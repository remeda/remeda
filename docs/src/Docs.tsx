import data from './data.json';
import { Menu } from './Menu';
import { FnDoc } from './FnDoc';
import type { FunctionsData } from '../scripts/transform';

const FUNCTIONS_DATA = data as unknown as FunctionsData;

export function Docs() {
  return (
    <div className="container-fluid">
      <div className="row flex-xl-nowrap">
        <Menu items={FUNCTIONS_DATA} />
        <div className="col-12 col-md-9 col-xl-10 py-md-3 main-content">
          {FUNCTIONS_DATA.map(data => (
            <FnDoc {...data} key={data.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
