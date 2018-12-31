import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!,
    $description: String!,
    $image: String,
    $largeImage: String,
    $price: Int!
  ) {
    createItem(
      title: $title,
      description: $description,
      image: $image,
      largeImage: $largeImage,
      price: $price
    ) {
      id
    }
  }
`

export default class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }

  handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  uploadFile = async e => {
    e.preventDefault()
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0])
    data.append('upload_preset','sickfits')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/rizasatyabudhi/image/upload',
      {
        method: 'POST',
        body: data
      }
    )

    const file = await res.json()
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })

  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
      {(createItem, { loading, error}) => (
        <Form onSubmit={async e => {
          e.preventDefault()
          const res = await createItem()
          Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
          })
        }}
        >
        <Error error={error} />
          <fieldset disabled={loading} aria-budy={loading}>
            <label htmlFor="file">
              Image
              <input
                name="file"
                id="file"
                placeholder="Upload an Image"
                type="file"
                required
                onChange={this.uploadFile}
                />
                {this.state.image && <img src={this.state.image} alt="upload preview" />}
            </label>

            <label htmlFor="title">
              Title
              <input
                name="title"
                id="title"
                placeholder="Title"
                type="text"
                required
                onChange={this.handleChange}
                value={this.state.title} />
            </label>
            <label htmlFor="price">
              Price
              <input
                name="price"
                id="price"
                placeholder="Price"
                type="number"
                required
                onChange={this.handleChange}
                value={this.state.price} />
            </label>
            <label htmlFor="description">
              Description
              <textarea
                name="description"
                id="description"
                placeholder="Enter A Description"
                required
                onChange={this.handleChange}
                value={this.state.description} />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
        )}
      </Mutation>
    )
  }
}

export { CREATE_ITEM_MUTATION }