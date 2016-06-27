var HeadRow = React.createClass({
    render: function() {
        return (
            <tr>
                <th>id</th>
                <th>name</th>
                <th>N</th>
                <th>M</th>
            </tr>
        );
    }
});

var NormalRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
                <td>{this.props.N}</td>
                <td>{this.props.M}</td>
            </tr>
        );
    }
});

var MoveButton = React.createClass({
    render: function() {
        return (
            <button type="button" className="btn btn-default btn-md" onClick={function() {
                this.props.pressCall(this.props.vec);
            }.bind(this)}>
                <span className={this.props.icon} aria-hidden="true"></span> {this.props.text}
            </button>
        );
    }
});

var MainTable = React.createClass({
    getInitialState: function() {
        return {data: [], pos: 1};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    pressCall: function(vector) {
        vector = parseInt(vector);
        if (this.state.pos + vector <= 0) {
            return;
        }
        this.state.pos += vector;
        var url = "sample/p" + this.state.pos + ".json";
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        var data = this.state.data;
        return (
            <div>
                <table className="table">
                    <thead>
                    <HeadRow />
                    </thead>
                    <tbody>
                    {data.map(
                        function(row) {
                            return <NormalRow id={row.id} name={row.name} N={row.N} M={row.M} />
                        }
                    )}
                    </tbody>
                </table>
                <MoveButton icon="glyphicon glyphicon-menu-left" text="Prev" pressCall={this.pressCall} vec="-1"/>
                <MoveButton icon="glyphicon glyphicon-menu-right" text="Next" pressCall={this.pressCall} vec="1"/>
            </div>
        );
    }
});
