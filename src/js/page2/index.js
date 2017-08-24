import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

window.React = React;


export class CommentList extends Component {
  render() {
    return (
      <div id="project-comments" className="commentList">
        <ul>
          {
              this.props.data.map((comment, index) => {
                  return <div key={index}>{comment.name}</div>
              })
          }
        </ul>
      </div>
    );
  }
};

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      find:"",
      data: [],
      offset: 0
    }
  }

  loadCommentsFromServer() {
    $.ajax({
      url      : this.props.url,
      data     : {limit: this.props.perPage, offset: this.state.offset, find:this.state.find},
      dataType : 'json',
      type     : 'GET',

      success: data => {
        this.setState({data: data.comments});
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
      this.loadCommentsFromServer();
    });
  };

  searchClick= (event)=>{
    this.loadCommentsFromServer();
  }

  handleSearchChange = (event)=>{
    this.setState({find:event.target.value});
  };

  render() {
    return (
      <div className="commentBox">
        <input type="text"  onChange={this.handleSearchChange}/>
        <button className="search-button" value = {this.state.find} onClick={this.searchClick}>Search</button>
        <CommentList data={this.state.data} />
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    );
  }
};

ReactDOM.render(
  <App url={'http://localhost/test_json/text.php?flag=showmessage'}
       perPage={2} />,
  document.getElementById('react-paginate')
);