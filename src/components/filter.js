import React, {Component} from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown'
import { filterTypes, filterNames, filterDays, filterTime } from './filterDropdown';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import '../css/filter.css'

import {
    filterEntryByName,
    filterEntryByDay,
    filterEntryByTime,
    filterUpdateType } from '../actions/entryActions';

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fTypeID: -1,
            fTypeString: "",
            fNameString: "",
            fDayString: "",
            fTimeString: "",
            bIsNamesPopulate: false
        }
        this.onSelectType = this.onSelectType.bind(this);
        this.onSelectName = this.onSelectName.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
    }

    componentDidMount() {
        this.props.filterUpdateType(this.state.fTypeID);
    }

    resetFilters() {
        this.setState({fNameString: "",
                        fDayString: "",
                        fTimeString: ""});
    }

    // On first trigger, populates the "name" dropdown list with alll the resturant names.
    populateNameList() {

        if(this.state.bIsNamesPopulate)
            return;

        var isDuplicate = false;
        for(var i = 0; i < this.props.entrylength; ++i) {

            // We check this entry with all the existing entries for duplicates, and only insert if it is not.
            isDuplicate = false;
            for(var j = 0; j < i; ++j) {
                if(i === j || this.props.entries[i].name === this.props.entries[j].name) {
                    isDuplicate = true;
                    break;
                }
            }
            if(!isDuplicate) {
                let name = {value:i, label:this.props.entries[i].name};
                filterNames.push(name);
            }
        }
        this.setState({bIsNamesPopulate: true});
    }

    // Choose the type of filter to use.
    onSelectType = (option) => {
        this.populateNameList();
        this.setState({fTypeID: option.value, fTypeString: option.label}, () => {
            this.props.filterUpdateType(this.state.fTypeID);
            this.resetFilters();
        });
    }

    // Choose the name to filter.
    onSelectName = (option) => {
        this.props.filterEntryByName(option.label);
        this.setState({fNameString: option.label});
    }

    // Choose the day to filter.
    onSelectDay = (option) => {
        this.props.filterEntryByDay(option.label.substring(0, 3).toString().toLowerCase()); // Take only the first 3 letters of the day
        this.setState({fDayString: option.label});
    }

    // Choose the time to filter.
    onSelectTime = (option) => {
        this.props.filterEntryByTime(option.value);
        this.setState({fTimeString: option.label});
    }

    renderFilterSubHeader1() {
        let disp = null;

        // Special case for filtering by Day Time
        if(this.state.fTypeID === 0) {
            disp = <th className="Dropdown-header-rname">FILTER NAME</th>
        }
        else if(this.state.fTypeID === 1) {
            disp = <th className="Dropdown-header-day">FILTER DAY</th>
        }
        else {
            disp = <th className="Dropdown-header-rname">FILTER LIST</th>
        }
        return disp;
    }

    // This subheader is currently only used for TIME field.
    renderFilterSubHeader2() {
        let disp = null;

        // Special case for filtering by Day Time. We do not need to display text here, only update the table CSS.
        if(this.state.fTypeID === 1) {
            disp = <th className="Dropdown-header-time">FILTER TIME</th>
        }
        return disp;
    }

    renderFilterSubDropdown1() {
        let disp = null;

        // Default disabled filter. Will only appear when page loads, before user chooses an option.
        if(this.state.fTypeID === -1) {
            disp =
            <td> <Dropdown disabled
                    arrowClosed={<span className="Dropdown-icon"><IoIosArrowDown/></span>}
                    arrowOpen={<span className="Dropdown-icon"><IoIosArrowUp/></span>}
                    className="Dropdown-class-disabled"
                    placeholder="Choose A FilterType..."
                    controlClassName="Dropdown-control"
                />
            </td>
        }

        // Filter by Name
        else if(this.state.fTypeID === 0) {
            disp = 
            <td> <Dropdown
                    arrowClosed={<span className="Dropdown-icon"><IoIosArrowDown/></span>}
                    arrowOpen={<span className="Dropdown-icon"><IoIosArrowUp/></span>}
                    options={filterNames}
                    onChange={this.onSelectName}
                    value={this.state.fNameString}
                    placeholder="Filter Name..."
                    className="Dropdown-class-rname"
                    controlClassName="Dropdown-control"
                    menuClassName="Dropdown-menu-name"
                />
            </td>
        }

        // Filter by Day and Time
        else if(this.state.fTypeID === 1) {
            disp = 
            <td> <Dropdown
                    arrowClosed={<span className="Dropdown-icon"><IoIosArrowDown/></span>}
                    arrowOpen={<span className="Dropdown-icon"><IoIosArrowUp/></span>}
                    options={filterDays}
                    onChange={this.onSelectDay}
                    value={this.state.fDayString}
                    placeholder="Filter Day..."
                    className="Dropdown-class-day"
                    controlClassName="Dropdown-control"
                    menuClassName="Dropdown-menu-day"
                />
            </td>
        }
        return disp;
    }

    // This subdropdown is currently only used for TIME field.
    renderFilterSubDropdown2() {
        let disp = null;

        if(this.state.fTypeID === 1) {
            disp = 
            <td> <Dropdown
                arrowClosed={<span className="Dropdown-icon"><IoIosArrowDown/></span>}
                arrowOpen={<span className="Dropdown-icon"><IoIosArrowUp/></span>}
                options={filterTime}
                onChange={this.onSelectTime}
                value={this.state.fTimeString}
                placeholder="Filter Time..."
                className="Dropdown-class-time"
                controlClassName="Dropdown-control"
                menuClassName="Dropdown-menu-time"
                />
            </td>
        }
        return disp;
    }

    render() {
        return (
            <div>
                <table className="Dropdown-section">
                <tbody>
                    <tr>
                        <th className="Dropdown-header-type">FILTER TYPE</th>
                        {this.renderFilterSubHeader1()}
                        {this.renderFilterSubHeader2()}
                    </tr>

                    <tr>
                        <td> <Dropdown
                            arrowClosed={<span className="Dropdown-icon"><IoIosArrowDown/></span>}
                            arrowOpen={<span className="Dropdown-icon"><IoIosArrowUp/></span>}
                            options={filterTypes}
                            onChange={this.onSelectType}
                            value={this.state.fTypeString}
                            placeholder="Filter Type..."
                            className="Dropdown-class-type"
                            controlClassName="Dropdown-control"
                            menuClassName="Dropdown-menu-type"
                            />
                        </td>

                        {this.renderFilterSubDropdown1()}
                        {this.renderFilterSubDropdown2()}
                    </tr>

                </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    entries: state.entries.items,
    entrylength: state.entries.items.length,
    filterName: state.entries.filterName,
    filterCount: state.entries.filterCount
});

export default connect(mapStateToProps, {filterEntryByName, filterEntryByDay, filterEntryByTime, filterUpdateType})(Filter);