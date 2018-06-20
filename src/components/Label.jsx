import React from 'react';
import styled from "styled-components";
import Draggable from 'react-draggable';
import Barcode from 'react-barcode'

const LabelComponent = styled.div.attrs({
    height: props => props.height || '3.75in',
    width: props => props.width || '5in'
})`
  background: white;
  box-shadow: 1px 1px 5px #00000054;
  height: ${props => props.height};
  width: ${props => props.width};
`;

const Dragger = styled.div.attrs({
    border: props => props.sel ? '2px dotted blue' : '2px dotted lightgray'
})`
    cursor: move;
    width: max-content;      
    border: ${props => props.border};
`;

const Text = styled.div.attrs({
    color: props => props.color || 'black',
    fontSize: props => props.fontSize || '20px',
    fontWeight: props => props.weight || 'normal',
})`
  padding: 5px;
  font-weight: ${props => props.weight};
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
`;

const Divider = styled.div.attrs({
    color: props => props.color || 'black',
    thickness: props => props.thickness || '2px'
})`
  width: 100%;
  height: 5px;
  margin-bottom: 5px;
  border-bottom: 2px solid black;
  color: ${props => props.color};
  border-width: ${props => props.thickness};
`;


export default class Label extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: props.height,
            width: props.width,
            elements: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState(nextProps);

    }

    handleStop(e) {
        const ind = e.path.findIndex(p=>p.className && typeof p.className === "string" && p.className.includes("react-draggable"));

        const styles = window.getComputedStyle(e.path[ind], null),
        regExp = /\(([^)]+)\)/,
        values = regExp.exec(styles.transform);
        const array = values[1].split(",");

        let selected = this.state.selected;
        selected.horAlign = parseInt(array[4]);
        selected.verAlign = parseInt(array[5]);
        this.setState({selected:selected})
    }

    select(e, id) {
        if (e.shiftKey) {
            this.props.setSelected([this.state.selected, this.state.elements.find(el => el.id === id)]);
        } else {
            this.props.setSelected(this.state.elements.find(el => el.id === id));
        }
    }

    getText(el) {
        if (el.data) {
            console.log(el.data);
            return this.props.data[el.data]
        } else if (el.text) {
            return el.text
        } else {
            return "ABC"
        }
    }

    isSelected(id) {
        const selected = this.state.selected;
        if (selected && selected[0]) {
            return selected.findIndex(s => s.id === id) > -1
        } else {
            return selected && selected.id === id
        }
    }

    render() {
        const {height, width, elements, selected, data} = this.state;

        return (
            <LabelComponent height={height} width={width}>
                {elements.map(el => {
                    if (el && el.name === "text") return (
                        <Draggable style={{width: "100px!important"}} key={el.id} position={{x: el.horAlign, y: el.verAlign}} onStart={(e) => this.select(e, el.id)} onStop={(e)=>this.handleStop(e)}>
                            <Dragger sel={this.isSelected(el.id)}>
                                <Text fontSize={el.fontSize}
                                      color={el.color}
                                      weight={el.weight}>
                                    {this.getText(el)}
                                </Text>
                            </Dragger>
                        </Draggable>
                    );

                    if (el && el.name === "divider") return (
                        <Draggable key={el.id} position={{x: el.horAlign, y: el.verAlign}} onStart={(e) => this.select(e, el.id)} onStop={(e)=>this.handleStop(e)}>
                            <Dragger style={{width: "100%"}} sel={this.isSelected(el.id)}
                                     onClick={(e) => this.select(e, el.id)}>
                                <Divider color={el.color}
                                         thickness={el.thickness}>
                                </Divider>
                            </Dragger>
                        </Draggable>
                    );

                    if (el && el.name === "barcode") return (
                        <Draggable key={el.id} position={{x: el.horAlign, y: el.verAlign}} onStart={(e) => this.select(e, el.id)} onStop={(e)=>this.handleStop(e)}>
                            <Dragger style={{width: "100%", textAlign: "center"}}
                                     sel={this.isSelected(el.id)} onClick={(e) => this.select(e, el.id)}>
                                <Barcode value={data.id} displayValue={false} width={el.barcodeWidth}
                                         height={el.barcodeHeight}/>
                            </Dragger>
                        </Draggable>
                    )
                })}

            </LabelComponent>
        );
    }
}

/*
Label.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string
};*/
