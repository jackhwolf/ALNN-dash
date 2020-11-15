import React from 'react';
import Table from 'react-bootstrap/Table';
import ReactPlayer from 'react-player'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.url = "http://alnn-api-backend-alb-147760409.us-east-2.elb.amazonaws.com"
    this.state = {
      search: {  // use this to filter results eventually
        sortKey: null,
        ascending: false,
        filterKey: null,
        filterLT: null,
        filterGT: null,
        filterEQ: null,
        queryKey: null,
        queryEQ: null
      },
      data: [    // JSON objects representing our data
        { 'r1': 'v1', 'Animation': 'https://www.youtube.com/watch?v=ONqETis6nX0' },
        { 'r1': 'v2', 'Animation': 'https://www.youtube.com/watch?v=ONqETis6nX0' }
      ],
      headers: []  // headers of table === keys of data
    }
  }

  // load the table
  render() {
    let rows = this.makeRows()
    let headers = this.state.headers
    return <>
      <Table striped bordered hover>
        <thead><tr>{headers}</tr></thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  }

  // when component mounts, call fetch to get data from api,
  // clean the data, and scrape out the table headers
  async componentDidMount() {
    var fetched_data = await this.getdata()
    var headers = this.getTableHeaders(fetched_data[0])
    this.setState({ data: fetched_data, headers: headers })
  }

  // fetch call to get data
  async getdata() {
    var resp = await fetch(this.url)
      .then(resp => resp.json())
    return resp
  }

  // strip table headers from JSON data object
  getTableHeaders(data) {
    return Object.keys(data).map((x) => <th key={x}>{x}</th>)
  }

  // turn a JSON object into a table row
  makeRow(index) {
    var data = this.state.data[index]
    var src_url = data.Animation
    console.log(src_url)
    data.Animation = <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={src_url}
        width='100%'
        height='50%%'
        controls={true}
      />
    </div>
    data = Object.values(data)
    var data_entries = []
    for (var i = 0; i < data.length; i++) {
      data_entries.push(<td key={i}>{data[i]}</td>)
    }
    return <tr key={index}>{data_entries}</tr>
  }

  // turn all JSON objects into a list of table rows
  makeRows() {
    var rows = []
    for (var i = 0; i < this.state.data.length; i++) {
      rows.push(this.makeRow(i))
    }
    return rows
  }
}

export default App;
