import React from 'react'
import { ColumnProps } from 'antd/lib/table'

let Status = (props: any)=>null
let PageTable = (props: any)=>null
let Forward = (props: any)=>null
let withUnit = ()=> {}

interface Props {
  stationStatusOptions: any[]
  lookStation: (id: number) => void
  handleStatusChange: (id, v) => void
}

class List10 extends React.Component<any, any> {
  getColumns(): ColumnProps<any>[] {
    return [
      {
        title: '序号',
        dataIndex: 'num',
        width: 65,
        align: 'center'
      },
      {
        title: '电站名称',
        dataIndex: 'title',
        width: 150,
        render: (text, record) => {
          return (
            <Forward to="stationDetail"
                     data={{stationId: record.id, showFooter: true, editable: false, energyEditable: true, onSuccess: () => null}}
                     title={record.title}>
              {text}
            </Forward>
          )
        }
      },
      {
        title: '运营商',
        dataIndex: 'operator',
        width: 100,
        render: (value) => {
          return value && value.title
        }
      },
      {
        title: '运维商',
        dataIndex: 'maintenance',
        width: 100,
        render: (value) => {
          return value && value.title
        }
      },
      {
        title: '终端用户',
        dataIndex: 'finalUser',
        width: 100,
        render: (value) => {
          return value && value.title
        }
      },
      {
        title: '电站类型',
        dataIndex: 'stationType',
        width: 90,
        render: (value) => {
          return value && value.title
        }
      },
      {
        title: '建设规模',
        dataIndex: 'scale',
        width: 87,
        align: 'right',
        render: (value, record) => {
          return value ? value + (record.scaleUnit || '') : ''
        }
      },
      {
        title: '额定功率',
        dataIndex: 'ratedPower',
        width: 90,
        align: 'right',
        render: (value) => {
          return withUnit(value, 'kW')
        }
      },
      {
        title: '投产时间',
        dataIndex: 'productionTime',
        width: 150,
        align: 'center'
      },
      {
        title: '电价信息',
        dataIndex: 'priceId',
        width: 80,
        render: (text, record) => {
          if (record.hasPrice) {
            return <a onClick={() => this.props.lookStation(record.id)}>查看</a>
          }
          return <div style={{color: 'red'}}>暂无</div>
        }
      },
      {
        title: '电站状态',
        width: 90,
        dataIndex: 'stationStatusTitle',
        align: 'center',
        render: (text, record) => {
          let code = null
          let id, title
          if (record.stationStatus) {
            id = record.stationStatus.id
            title = record.stationStatus.title
          }
          let match = this.props.stationStatusOptions.find(o => o.value == id)
          if (match) {
            code = match.code
          }
          return (
            <Status disabled={record._isDisabled} options={this.props.stationStatusOptions} current={id} onChange={v => this.props.handleStatusChange(record.id, v)}
                    code={code}>
              {title}
            </Status>
          )
        }
      },
      {
        title: '状态时间',
        dataIndex: 'stationStatusTime',
        width: 150,
        align: 'center',
        render: (text, record) => (
          text
          // <Forward to="stationStatus" data={{ record }}>
          //   {text}
          // </Forward>
        )
      },
      {
        title: '操作',
        width: 60,
        render: (text, record) => {
          return (
            <Forward to="stationDetail" data={{stationId: record.id, showFooter: true, editable: false, energyEditable: true, onSuccess: () => null}}
                     title={record.title}>
              维护
            </Forward>
          )
        }
      }
    ]
  }
}

export default List10

// auto-column
