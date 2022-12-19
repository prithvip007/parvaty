import React from 'react';
import ApiHandler from '../../model/ApiHandler';
import AddCronJobModal from "./AddCronJobModal";
import EditCronJobModal from './EditCronJobModal';
import Loader from '../../components/template/Loader';

class CronJobsCard extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            crons: {},
            serviceLoadding: false,
            editCron: null,
            editIndex: -1,
            showModal: false,
        }
        this.apiHandler = new ApiHandler();
        this.createCron = React.createRef();
        this.editCron = React.createRef();

    }
    componentDidMount() {
        this.getCrons();
    }
    getCrons = () => {
        this.setState({ serviceLoadding: true })
        this.apiHandler.getCronJobs(this.server.id, (data) => {
            this.setState({ crons: data, serviceLoadding: false })
        })
    }
    cronSuspend = (event) => {
        let tmpJobID = event.target.getAttribute("jobid");
        this.cronAction('suspend', tmpJobID)
    }
    cronUnsuspend = (event) => {
        let tmpJobID = event.target.getAttribute("jobid");
        this.cronAction('unsuspend', tmpJobID)
    }
    cronDelete = (cronID) => {
        this.cronAction('delete', cronID)
    }
    cronAction = (action, cronId) => {
        this.setState({ serviceLoadding: true })
        this.apiHandler.cronAction(this.server.id, cronId, action, (data) => {
            this.getCrons();
        })
    }
    cronEdit = (event) => {
        let tmpJobID = event.target.getAttribute("jobid");
        this.setState({ editCron: this.state.crons[tmpJobID], editIndex: tmpJobID, showModal: true })
        this.handleEditModalShow()
    }
    cancelEdit = () => {
        this.setState({ editCron: null, showModal: false, editIndex: -1 })
    }
    renderCrons = () => {
        let output = [];
        let tmpout = null;
        let tmpbuffer = null;
        Object.keys(this.state.crons).forEach(key => {
            tmpout = this.state.crons[key];
            tmpbuffer = <tr key={tmpout.JOB}>
                <td>#{tmpout.JOB}</td>
                <td>{tmpout.MIN} {tmpout.HOUR} {tmpout.DAY} {tmpout.MONTH} {tmpout.WDAY}</td>
                <td>{tmpout.CMD}</td>
                <td className="text-center">
                    {(tmpout.SUSPENDED === "no") ?
                        <><i className="fa fa-check text-success" title="Running"></i></>
                        :
                        <><i className="fa fa-times text-danger" title="Suspended"></i></>
                    }
                </td>
                <td className="text-center">
                    <div className="">
                        <button type="button" onClick={()=>this.cronDelete(tmpout.JOB)} className="btn btn-danger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {
                                this.state.serviceLoadding ?
                                    <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                    : <i className="fa fa-trash"></i>
                            }
                        </button>
                    </div>
                </td>
            </tr>
            output.push(tmpbuffer)
        })
        return output;
    }
    handleModalClose = () => {
        this.createCron.handleModalClose();
    }
    handleModalShow = () => {
        this.createCron.current.handleModalShow();
    }
    handleEditModalShow = () => {
        this.editCron.current.handleModalShow();
    }
    handleEditModalClose = () => {
        this.editCron.handleModalClose();
    }
    render() {
        return (
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 full-height">
                <div className="card server-health">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="heading">Cron Jobs</h6>
                                <p className="sub-heading">Check Cron Jobs </p>
                            </div>
                            <div className="col-2 text-right align-self-center">
                                <button onClick={this.handleModalShow} className="btn btn-theme btn-square btn-35">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "10px" }}>ID</th>
                                    <th>Schedule</th>
                                    <th>Command</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.serviceLoadding) ?
                                    <tr>
                                        <td className="text-center" colSpan="5">
                                            <Loader type="card" />
                                        </td>
                                    </tr>
                                    :
                                    this.renderCrons()
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <EditCronJobModal key={this.state.editIndex} cron={this.state.editCron} cronUpdated={this.getCrons} serverId={this.server.id} cancel={this.cancelEdit} ref={this.editCron} handleModalClose={this.handleEditModalClose} handleModalShow={this.handleEditModalShow} modalView={this.state.showModal} />
                <AddCronJobModal cron={this.state.editCron} cronUpdated={this.getCrons} serverId={this.server.id} cancel={this.cancelEdit} ref={this.createCron} handleModalClose={this.handleModalClose} handleModalShow={this.handleModalShow} modalView={this.state.showModal} />
            </div>
        )
    }
}

export default CronJobsCard;