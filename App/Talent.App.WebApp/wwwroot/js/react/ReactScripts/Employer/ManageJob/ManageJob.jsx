import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Button, Card, Dropdown, Image, Label, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            activeSortBy:'',
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            activeFilter:'',
            pageSize: 6
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleDrpChange = this.handleDrpChange.bind(this),
        this.pageChange = this.pageChange.bind(this)
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = true;
       //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var listingUrl = 'https://ttalent.azurewebsites.net/'; //http://localhost:51689/
        var link = listingUrl+'listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        var params = Object.assign({},{activePage:this.state.activePage} ,this.state.filter, { sortbyDate: this.state.sortBy.date })
        
        $.ajax({
            url: link,
            data: params,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                if (res.success == true) {
                    var loader = this.state.loaderData;
                    loader.isLoading = false;
                    this.setState({
                        loadData: loader,
                    })
                    this.setState({
                        loadJobs: res.myJobs,
                        totalPages: Math.ceil(res.totalCount / this.state.pageSize)
                    })
                    // TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    //TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader,
                })
            })
        });
    }

    filterby() {
        const options = [{
            value: 'showActive',
            text: 'Active',
            key: 'showActive'
        },
        {
            value: 'showClosed',
            text: 'Closed',
            key: 'showClosed'
        },
        {
            value: 'showDraft',
            text: 'Draft',
            key: 'showDraft'
        },
        {
            value: 'showExpired',
            text: 'Expired',
            key: 'showExpired'
        },
        {
            value: 'showUnexpired',
            text: 'Unexpired',
            key: 'showUnexpired'
        }
        ];
        return (<Dropdown options={options}
            placeholder='select' value={this.state.activeFilter} onChange={this.handleDrpChange} >
        </Dropdown>)
    }
    handleDrpChange(e, data) {
        switch (data.value) {
            case 'showActive': {
                this.setState({
                    activePage:1,
                    activeFilter: 'showActive',
                    filter: {
                        showActive: true,
                        showClosed: false,
                        showDraft: false,
                        showExpired: false,
                        showUnexpired: true
                    },
                }, this.loadNewData(this.state))
            }; break;
            case 'showClosed': this.setState({
                activePage:1,
                activeFilter: 'showClosed',
                filter: {
                    showClosed: true,
                    showActive: false,
                    showDraft: false,
                    showExpired: false,
                    showUnexpired: true
                }
            }, this.loadNewData(this.state)); break;
            case 'showDraft': this.setState({
                activePage:1,
                activeFilter: 'showDraft',
                filter: {
                    showDraft: true,
                    showActive: false,
                    showClosed: false,
                    showExpired: false,
                    showUnexpired: false
                }
            }, this.loadNewData(this.state)); break;
            case 'showExpired': this.setState({
                activePage:1,activeFilter: 'showExpired',
                filter: {
                    showClosed: false,
                    showActive: false,
                    showDraft: false,
                    showExpired: true,
                    showUnexpired: false
                }
            }, this.loadNewData(this.state)); break;
            case 'showUnexpired': this.setState({
                activePage:1,activeFilter: 'showUnexpired',
                filter: {
                    showClosed: false,
                    showActive: true,
                    showDraft: false,
                    showExpired: false,
                    showUnexpired: true
                }
            }, this.loadNewData(this.state)); break;
            case 'desc': {
                this.setState({
                    activeSortBy: "desc",
                    activePage:1,
                    sortBy: {
                        date: "desc"
                    }
                }, this.loadNewData(this.state))
            }; break;
            case 'aesc': {
                this.setState({
                    activeSortBy: "aesc",activePage:1,
                    sortBy: {
                        date: "aesc"
                    }
                }, this.loadNewData(this.state))
            }; break;
            
        }
    }

    sortBy() {
        const options = [{
            value: 'desc',
            text: 'Newest First',
            key: 'desc'
        },
        {
            value: 'aesc',
            text: 'Oldest First',
            key: 'aesc'
        }
        ];
        return (<Dropdown options={options}
            placeholder='select' value={this.state.activeSortBy} onChange={this.handleDrpChange} >
        </Dropdown>)
    }
    pageChange(e, data){
            this.setState({
                activePage: data.activePage
    }, this.loadNewData(this.state))
 }
    renderJobData() {
        return (<div className='ui container'>
            <div style={{ "padding": "5px" }}>
                <Card.Group>
                    {this.state.loadJobs.map((job, i) => {
                        return (<JobSummaryCard key={i} jobdetail={job} />)
                    })}

                </Card.Group>
            </div><div className="ui center">
                <Pagination
                    boundaryRange={3}
                    totalPages={this.state.totalPages}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    activePage={this.state.activePage}
                    onPageChange={this.pageChange}
                />
            </div>
        </div>
        );


    }
    render() {
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h2>List Of Job</h2><br />
                    <div>
                        <div><label><i className="filter icon"></i>Filter: </label>
                            {this.filterby()}
                            <span>  </span>
                            <label><i className="calendar alternate outline icon"></i>SortBy: </label>
                            {this.sortBy()}
                        </div>
                        <br></br>
                        {this.state.loadJobs.length !== 0 ? this.renderJobData() : <strong>Sorry, No Jobs Available</strong>}
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}