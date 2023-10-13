import React, { Component } from 'react';
import { Col, Row } from 'antd';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { SECOND } from 'lib/consts';
import { generateListStub } from 'stubs/utils';
import { LOG } from 'stubs/log';
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import iconSuccess from 'icons/status/success.svg';
import { Icon } from '@chakra-ui/react';
import { getRenderPropValue } from 'antd/es/_util/getRenderPropValue';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';


class PocGrid extends Component {
  componentDidMount() {
    this.draw();
  }

  draw() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    // horizontal line
    ctx.moveTo(293, 220);
    ctx.lineTo(493, 220);

    ctx.moveTo(689, 220);
    ctx.lineTo(889, 220);

    ctx.moveTo(398, 240);
    ctx.lineTo(795, 240);

    ctx.moveTo(638, 305);
    ctx.lineTo(1090, 305);

    ctx.moveTo(1000, 340);
    ctx.lineTo(1285, 340);

    // vertical line
    ctx.moveTo(293, 145);
    ctx.lineTo(293, 175);
    ctx.moveTo(493, 145);
    ctx.lineTo(493, 175);
    ctx.moveTo(689, 145);
    ctx.lineTo(689, 175);
    ctx.moveTo(889, 145);
    ctx.lineTo(889, 175);
    
    ctx.moveTo(1090, 205);
    ctx.lineTo(1090, 305);

    ctx.moveTo(1285, 150);
    ctx.lineTo(1285, 340);

    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  render() {
    return (
        <canvas ref="canvas" width={2000} height={1000}></canvas>
    );
  }
}

function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return '0x' + Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

const TxPoc: React.FC = () => {

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const onchainInput = "";
  const onchainOutput = "";
  const offchainInput = txInfo.data.hash + txInfo.data.nonce + txInfo.data.max_priority_fee_per_gas + txInfo.data.max_fee_per_gas + txInfo.data.value + txInfo.data.raw_input;
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_logs',
    pathParams: { hash: txInfo.data?.hash },
    options: {
      enabled: !txInfo.isPlaceholderData && Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
      placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });
  var offchainOutput = "";
  if (data?.items.length != 0) {
    offchainOutput = data?.items[0].data;
  }
  const teePublicKey = "0x8815c63eee1c33c21761c180144c1414c7d2925c"; // test
  const onchainInputHash = sha256(onchainInput);
  const onchainOutputHash = sha256(onchainOutput);
  const offchainInputHash = sha256(offchainInput);
  const offchainOutputHash = sha256(offchainOutput);
  const hash = sha256(sha256(onchainInputHash + onchainOutputHash) + sha256(offchainInputHash + offchainOutputHash));
  const sign = sha256(hash);
  const calPublicKey = teePublicKey;

  const pocGridStyle = {
    position: 'absolute',
    top: 0,
    zIndex: -1,
  };

  const pocResultStyle = {
    position: 'absolute',
    top: 300,
    zIndex: 1,
    color: 'green',
    display: 'flex',
  };

  const title = {
    color: '#2C5282',
    backgroundColor: '#EBF8FF',
  }

  return (
    <><div>
      <Row gutter={[8, 8]} style={title}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle">Onchain Input</Col>
        <Col span={3} align="middle">Onchain Output</Col>
        <Col span={3} align="middle">Offchain Input</Col>
        <Col span={3} align="middle">Offchain Output</Col>
        <Col span={3} align="middle">Sign</Col>
        <Col span={3} align="middle">TEE Public Key</Col>
        <Col span={3} align="middle"></Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle">Tx Info</Col>
        <Col span={3} align="middle"><HashStringShorten hash={ onchainInput }/><CopyToClipboard text={ onchainInput }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ onchainOutput }/><CopyToClipboard text={ onchainOutput }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ offchainInput }/><CopyToClipboard text={ offchainInput }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ offchainOutput }/><CopyToClipboard text={ offchainOutput }/></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ teePublicKey }/><CopyToClipboard text={ teePublicKey }/></Col>
        <Col span={3} align="middle"></Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
        <Col span={3}>　</Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle">PoC</Col>
        <Col span={3} align="middle"><HashStringShorten hash={ uint8ArrayToHexString(onchainInputHash) }/><CopyToClipboard text={ uint8ArrayToHexString(onchainInputHash) }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ uint8ArrayToHexString(onchainOutputHash) }/><CopyToClipboard text={ uint8ArrayToHexString(onchainOutputHash) }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ uint8ArrayToHexString(offchainInputHash) }/><CopyToClipboard text={ uint8ArrayToHexString(offchainInputHash) }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ uint8ArrayToHexString(offchainOutputHash) }/><CopyToClipboard text={ uint8ArrayToHexString(offchainOutputHash) }/></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ uint8ArrayToHexString(sign) }/><CopyToClipboard text={ uint8ArrayToHexString(sign) }/></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle">|</Col>
        <Col span={3} align="middle">|</Col>
        <Col span={3} align="middle">|</Col>
        <Col span={3} align="middle">|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="left">|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="left">|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="left">　　　|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="left"><HashStringShorten hash={ uint8ArrayToHexString(hash) }/><CopyToClipboard text={ uint8ArrayToHexString(hash) }/></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="left">　　　|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle">|</Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"><HashStringShorten hash={ calPublicKey }/><CopyToClipboard text={ calPublicKey }/></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col>
        <Col span={3} align="middle"></Col> 
      </Row>
      </div>
      <div style={pocGridStyle}><PocGrid/></div>
      <div style={pocResultStyle}><Icon as={ iconSuccess } boxSize="28px" color="green.500" ml={ 1 }/><p>Verification Passed</p></div>
    </>
  );
};


export default TxPoc;
