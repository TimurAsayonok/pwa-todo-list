import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    items: [],
    loading: true,
    todoItem: '',
    offline: !navigator.onLine
  }

  componentDidMount() {
    this.onGetItems();

    //event listeners for online or offline for window
    window.addEventListener('online', this.setOfflineStatus)
    window.addEventListener('offline', this.setOfflineStatus)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOfflineStatus)
    window.removeEventListener('offline', this.setOfflineStatus)
  }

  onGetItems = () => {
    fetch('http://localhost:4567/items.json')
      .then(response => response.json())
      .then(items => {
        this.setState({
          items, loading: false
        })
      })
  }

  onAddItem = (e) => {
    e.preventDefault();

    fetch('http://localhost:4567/items.json', {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoItem }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(items => this.setState({ items, todoItem: '' }))
  }

  onDeleteItem = (itemId) => {
    fetch('http://localhost:4567/items.json', {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(items => this.setState({ items }))
  }

  setOfflineStatus = () => {
    this.setState({ offline: !navigator.onLine })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <img src={logo} className="App-logo" alt="logo"/>
            My Todo List 2
          </span>
          {/* Added offline badget */}
          {this.state.offline && (
            <span className="badge badge-danger my-3">
              Offline
          </span>
          )}

        </nav>
        <div className="px-3 py-2">
          <form className="form-inline my-3" onSubmit={this.onAddItem}>
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={this.state.todoItem}
                onChange={e => this.setState({
                  todoItem: e.target.value
                })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2 col-4 col-sm-2"
            >
              ADD
            </button>
          </form>

          { this.state.loading && <p>Loading...</p> }

          { !this.state.loading && this.state.items.length === 0 && (
            <div className="alet alert-secondary">
              No items - all done!
            </div>
          )}

          { !this.state.loading && this.state.items && (
            <table className="table table-striped">
              <tbody>
                { this.state.items.map((item, i) => {
                  return (
                    <tr key={item.id} className="row">
                      <td className="col-1">{i + 1}</td>
                      <td className="col-10">{item.item}</td>
                      <td className="col-1">
                        <button
                          type="button"
                          className="close"
                          aria-label="Close"
                          onClick={() => this.onDeleteItem(item.id)}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default App;
