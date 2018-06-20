import React from 'react';
import styled from "styled-components";
import Label from './Label.jsx'

const LabelContainer = styled.div`
   background: #efefef;
   width: 100vw;
   height: 100vh;
     
`;

const data = {
    product: "2:1 Sativa (Green Crack/BaOx",
    ingredients: "Cannabis (whole flower and trim)",
    pesticides: "None",
    soldBy: "SPARKET 6051239393",
    additionalGrower: "Sustainnabis 6039299230",
    id: "WAJ416103.IN51920",
    labId: "IN4XPJ9"
};

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: "3.75in",
            width: "5in",
            elements: []
        };
    }

    changeSize(e, val) {
        this.setState({
            [val]: e.target.value + "in",
        });
    };

    addElement(val) {
        let options = {horAlign: 0, verAlign: 0};
        this.state.elements.push({name: val, id: Math.floor(Math.random()*90000) + 10000, ...options});
        this.setState({elements: this.state.elements});
    }

    changeAttribute(attr, val) {
        const selected = this.state.selected;
        let el = selected[0] ? selected[0] : selected;
        console.log(attr, val);
        el[attr] = val;
        console.log(el);
        let elementsInstance = this.state.elements;
        const ind = elementsInstance.findIndex(els=>els.id===el.id);
        elementsInstance[ind] = el;
        this.setState({elements: elementsInstance});
    }

    render() {
        const {height, width, elements, selected} = this.state;

        return (
            <LabelContainer className="flex-column justify-center align-center">


                <div style={{position: "relative"}}>

                    <div style={{position: "absolute", right: "-363px", top: "0px"}} className="flex-column">
                        <div className="flex-row">
                            <input onKeyUp={e => this.changeSize(e, 'height')}/>
                            <input onKeyUp={e => this.changeSize(e, 'width')}/>
                        </div>

                        <button onClick={e=> this.addElement("text")}>ABC</button>
                        <button onClick={e=> this.addElement("divider")}>______</button>
                        <button onClick={e=> this.addElement("barcode")}>Barcode</button>

                        {selected && selected.name === "text" &&
                        <React.Fragment>
                            <input placeholder="Text" onKeyUp={e=>this.changeAttribute("text", e.target.value)} />
                            <input placeholder="Font size" onKeyUp={e=>this.changeAttribute("fontSize", e.target.value + "px")} />
                            <button onClick={e=>this.changeAttribute("weight", "bold")}>B</button>
                            <select onChange={e=>this.changeAttribute("data", e.target.value)}>
                                {Object.keys(data).map((item) => (
                                    <option value={item}>{item}</option>)
                                )}
                            </select>
                        </React.Fragment>
                        }

                        {selected && selected.name === "divider" &&
                        <React.Fragment>
                            <input placeholder="Thickness" onKeyUp={e=>this.changeAttribute("thickness", e.target.value + "px")} />
                        </React.Fragment>
                        }

                        {selected && selected.name === "barcode" &&
                        <React.Fragment>
                            <input placeholder="Height" onKeyUp={e=>this.changeAttribute("barcodeHeight", e.target.value)} />
                            <input placeholder="Width" onKeyUp={e=>this.changeAttribute("barcodeWidth", e.target.value)} />
                        </React.Fragment>
                        }

                        {selected && selected[1] &&
                        <React.Fragment>
                            <button onClick={e=>this.changeAttribute("horAlign", selected[1].horAlign)}>Align vertical</button>
                            <button onClick={e=>this.changeAttribute("verAlign", selected[1].verAlign)}>Align horizontal</button>
                        </React.Fragment>
                        }

                    </div>

                    <Label height={height} width={width} elements={elements} setSelected={selected=>this.setState({selected:selected})} selected={selected} data={data}/>

                </div>

            </LabelContainer>
        );
    }
}




