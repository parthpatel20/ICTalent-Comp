import React from 'react';
import Cookies from 'js-cookie';
import { Pagination, Icon, Button, Card, Dropdown, Image, Label, Checkbox, Accordion, Form, Segment, Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            JobSummary: !this.props.jobdetail ? this.props.jobdetail : ''
        }
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var listingUrl = 'https://ttalent.azurewebsites.net/'; //http://localhost:51689/
        var link = listingUrl+'listing/listing/closeJob';
        var cookies = Cookies.get('talentAuthToken');
        
        $.ajax({
            url: link,
            data:  JSON.stringify(id),
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json charset=utf-8'
            },
            dataType: 'json',
            type: "POST",
            success: function (res) {
                
                if (res.success == true) {
                    TalentUtil.notification.show(res.message, "success", null, null)
                    window.location = "/ManageJobs";
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    Buttons(name, icon, onclick) {
        return (<Button basic size='mini' color='blue' onClick={onclick}>
            <Icon name={icon} />
            {name}
        </Button>)
    }
    jobStatusLabel(status) {
        
        switch (status) {
            case 0: return ((<Label color='green' size='large' horizontal>
                <strong>Active</strong>
            </Label>))
            case 1: return ((<Label color='red' size='large' horizontal>
                <strong>Closed</strong>
            </Label>))
        }
    }
    render() {

        //const jobDetail=this.props.jobdetail?this.props.jobdetail:'';

        return (<Card style={{ "width": "auto" }}>
            <Card.Content>
                <Card.Header>{this.props.jobdetail.title}</Card.Header>
                <Label as='a' color='black' ribbon='right'>
                    <Icon name='user'></Icon>0
</Label>
                <Card.Meta><Icon name='map marker'></Icon>{this.props.jobdetail.location.city},{this.props.jobdetail.location.country}</Card.Meta>

                <Card.Description style={{ "height": '150px', 'width': '260px' }}>
                    <strong>{this.props.jobdetail.summary}</strong>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div>
                    <div style={{ "float": 'left' }}>
                        {this.jobStatusLabel(this.props.jobdetail.status)}

                    </div>
                    <div style={{ "float": 'right' }}>

                        <Button basic size='mini' color='blue' onClick={()=>this.selectJob(this.props.jobdetail.id)}>
                            <Icon name='stop' />
                            Close
                        </Button>
                        <Button basic size='mini' color='blue' onClick={()=>window.location = `/EditJob/${this.props.jobdetail.id}`}>
                            <Icon name='edit' />
                            Edit
                        </Button>
                        {this.Buttons('Copy', 'copy')}

                    </div>
                </div>
            </Card.Content>
        </Card>
        )
    }
}