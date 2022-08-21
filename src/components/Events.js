import { useContext, useEffect, useState } from 'react'
import { Button, Modal, Form, Input, DatePicker, InputNumber, message, Table } from 'antd'
import { postRequest, getRequest } from '../api/ApiHandler'
import AuthContext from '../context/auth-context'
import moment from 'moment'

const Events = () => {
  const [form] = Form.useForm()
  const { token } = useContext(AuthContext)
  const { TextArea } = Input
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [columnData, setColumnData] = useState([])
  const [loadingTable, setLoadingTable] = useState(true)

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
  ]

  const tableProps = {
    loadingTable,
  }

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const onFinish = (values) => {
    if (!values.title || !values.description || !values.price || !values.date) {
      message.error('Please fill all the required fields')
      return
    }
    setLoading(true)
    const event = { title: values.title, description: values.description, price: +values.price, date: values.date.format('YYYY-MM-DD HH:mm').toString() }
    let query = {
      query: `mutation {
      createEvent(eventInput: {
        title: "${event.title.toString()}", description: "${event.description.toString()}", price: ${event.price}, date: "${event.date.toString()}"
      }) {
        _id
        title
        description
        price
        date
        creator {
          _id
          email
        }
      }
    }`,
    }

    postRequest(query, token.toString())
      .then((res) => {
        setLoading(false)
        if (res?.data?.errors && res?.data?.errors?.length > 0) {
          throw new Error(res.data.errors[0].message)
        }
        message.success('The request was successful.')
      })
      .catch((err) => {
        setLoading(false)
        if (err) {
          message.error(err.toString())
        } else {
          message.error('An error occurred while processing the request')
        }
      })
  }

  const titleConfig = {
    rules: [{ required: true, message: 'Please add a title!' }],
  }

  const descriptionConfig = {
    rules: [{ required: true, message: 'Please add a description!' }],
  }

  const priceConfig = {
    rules: [{ required: true, message: 'Please select add a price!' }],
  }

  const dateTimeConfig = {
    rules: [{ type: 'object', required: true, message: 'Please select date and time!' }],
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }

  useEffect(() => {
    if (columnData.length === 0) {
      const query = {
        query: `query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }`,
      }

      getRequest(query)
        .then((res) => {
          setLoadingTable(false)
          if (res?.data?.data?.events) {
            let newData = res?.data?.data?.events.map((d, index) => {
              return { key: index, title: d.title, description: d.description, price: d.price, date: moment(d.date).format('YYYY-MM-DD HH:mm') }
            })

            setColumnData(newData)
          }
        })
        .catch((err) => {
          setLoadingTable(false)
          console.error(err)
        })
    }
  }, [columnData])

  return (
    <>
      <Modal
        title="Add an event"
        visible={isModalVisible}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
          <Button key="cancel" type="primary" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form layout={'vertical'} form={form} initialValues={{ layout: 'vertical' }} onFinish={onFinish}>
          <Form.Item name="title" label="Title" {...titleConfig}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" {...descriptionConfig}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="price" label="Price" {...priceConfig}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="date" label="DatePicker" {...dateTimeConfig}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
      {token && (
        <div>
          <Button type="primary" onClick={openModal} className="openModalBtn">
            Create Event
          </Button>
        </div>
      )}

      <section className="event_list">{columnData && columnData.length > 0 ? <Table {...tableProps} columns={columns} dataSource={columnData} onChange={onChange} /> : null}</section>
    </>
  )
}

export default Events
