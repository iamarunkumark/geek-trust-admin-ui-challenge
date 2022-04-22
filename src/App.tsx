import './App.css';
import { UserDataTable } from './features/table/TableView';

function App() {
  return (
    <div className="App">
        <h1 data-testid='geek'>Geek Trust Challenge App</h1>
        <UserDataTable />
    </div>
  );
}

export default App;
