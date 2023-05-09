import { Slider, Row, Col, Statistic } from 'antd';

function progressbar(props) {
    const {softcap, hardcap} = props;
    const marks = {};
    const obj = {
        style: {
            marginTop: '13px',
            color: 'white'
        },
    }
    marks[0] = {...obj, 
        'label': <strong>0 tBNB</strong>};
    marks[softcap] = {...obj,
        'label': <strong>0.1 tBNB</strong>};
    const hard_obj = {
        style: {
            marginTop: '13px',
            width: '100%',
            color: '#f50',
            size: "240px"
        },
    }
    hard_obj['label'] = <strong>{hardcap} tBNB</strong>;
    marks[hardcap] = hard_obj;

    return (
        <>
            <h2 style={{color: 'white', fontSize: "25px", fontWeight: 'bold', marginBottom: "20px"}}>My Deposit : </h2>
            <h2 style={{color: 'white', fontSize: "20px", fontWeight: 'bold'}}>Total Deposit : </h2>
            <Slider dotStyle={{ borderColor: 'red', borderWidth: 7 }} activeDotStyle={{ borderColor: 'green' }} style={{width: "80%" }} handleStyle={{width: "5px", height: "5px", mark: 'red'}} trackStyle={{height: "10px", backgroundColor: 'cyan'}} min={0} max={1} marks={marks} step={0.01} defaultValue={0.5}/>
            <Row gutter={2}>
                <Col span={16}>
                <Statistic
                    value={"2023/5/8 00:00"}
                    valueStyle={{
                        color: '#3f8600'
                    }}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                    value={"2023/5/9 11:00"}
                    valueStyle={{
                        color: '#cf1322',
                    }}
                    />
                </Col>
            </Row>
        </>
    )
}
export default progressbar;