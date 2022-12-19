import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ServerCard from '../components/ServerCard';
import ApiHandler from '../model/ApiHandler';
// import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import ServerDetails from '../components/ServerDetails';
import "../assets/css/dashboard.css";
import CreateServerScreen from "./CreateServerScreen";
import PageHeader from '../components/template/PageHeader';
import Pagination from '../components/template/Pagination';
import { read_cookie } from 'sfcookies';
import { Alert } from 'react-bootstrap';
import Loader from '../components/template/Loader';

class Servers extends React.Component {
    constructor(props) {
        super();
        let serverId = props.match.params.serverId;
        this.state = {
            serverData: {},
            servers: [],
            regions: {},
            projectName: read_cookie('projectName'),
            projectId: read_cookie('projectId'),
            selectedServer: null,
            isServerClicked: false,
            loading: true,
            showModal: false,
            serverId: serverId,
            screenName: "Servers",
            accessStatus: null,
        }
        this.apiHandler = new ApiHandler();
        this.createServer = React.createRef();
    }
    showError = (err) => {

    }
    componentDidMount() {
        document.title = "Your Servers";
        this.getServers();
        this.getRegions();
    }
    getRegions = () => {
        this.apiHandler.getRegions((regions) => {
            let tmp_regions = this.state.regions;
            regions.forEach(region => {
                tmp_regions[region.slug] = region.name
            })
            this.setState({ regions: tmp_regions })
        }, (err) => {
            console.log(err)
        })
    }
    getServers(page = 1) {
        this.setState({ loading: true, accessStatus: null, })
        this.apiHandler.getServers(page, (msg, data) => {
            data.data.forEach((s) => {
                if (s.uuid === this.state.serverId) {
                    this.setState({
                        selectedServer: s,
                        isServerClicked: true
                    })
                }
            })
            this.setState({ accessStatus: msg, servers: data.data, loading: false, serverData: data })
        }, err => {
            this.showError(err);
            this.setState({ loading: false, accessStatus: err, })
        })
    }
    getRegionName = (slug) => {
        return this.state.regions[slug];
    }
    renderServers() {

        let servers = [];
        this.state.servers.forEach((data, index) => {
            if (data.project_id !== null) {
                servers.push(<ServerCard reloadServers={this.handlePageChange} serverClickHandler={this.serverClickHandler} region={this.getRegionName(data.region)} key={data.id} server={data} />);
            }
        })
        return servers;
    }
    serverClickHandler = (server = null) => {
        if (server) {
            if (server.status === "READY") {
                this.setState({ selectedServer: server });
                if (!this.state.isServerClicked) {
                    window.history.replaceState(null, null, "/servers/" + server.uuid)
                }
                this.setState({
                    isServerClicked: !this.state.isServerClicked,
                    screenName: server.name
                })
            }
        }
    }
    goBack = () => {
        if (this.state.isServerClicked) {
            window.history.replaceState(null, null, "/servers")
        }
        this.setState({
            isServerClicked: !this.state.isServerClicked,
        })
    }
    handleModalClose = () => {
        this.createServer.handleModalClose();
    }
    handleModalShow = () => {
        this.createServer.current.handleModalShow();
    }
    handlePageChange = (data) => {
        this.getServers(data)
    }
    refreshPage = () => {
        if (this.state.isServerClicked) {
            window.history.replaceState(null, null, "/servers")
        }
        this.setState({
            isServerClicked: false,
            serverId: null
        })
        this.getServers();
        this.getRegions();
    }
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation onProjectChange={this.refreshPage} name={this.state.screenName} />
                <Sidebar />
                <div className="content-wrapper">
                    <div className="section-container">
                        {(this.state.loading) ? <Loader /> :
                            <>
                                {(this.state.isServerClicked) ?
                                    <ServerDetails serverClickHandler={this.goBack} server={this.state.selectedServer} />
                                    :
                                    <>
                                        <PageHeader heading="My Servers" subHeading={this.state.servers.length + " Servers"}>
                                            <div className="row">
                                                <div className="col-md-4" style={{ marginLeft: 'auto' }}>
                                                    <button type="button" onClick={this.handleModalShow} className="btn btn-theme btn-block">
                                                        <span>Create Server</span>
                                                        <i className="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </PageHeader>
                                        <div className="row">
                                            <div className="col-12">
                                                <Alert show={(this.state.accessStatus !== null && this.state.accessStatus !== "Your Droplets") ? true : false} variant="info">
                                                    {this.state.accessStatus}
                                                </Alert>
                                            </div>
                                            {this.renderServers()}
                                        </div>
                                        <Pagination onPageChange={this.handlePageChange} key={this.state.serverData.current_page} data={this.state.serverData}></Pagination>
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
                <CreateServerScreen ref={this.createServer} handleModalClose={this.handleModalClose} handleModalShow={this.handleModalShow} modalView={this.state.showModal} />
            </div>
        );
    }
}
export default withRouter(Servers);
