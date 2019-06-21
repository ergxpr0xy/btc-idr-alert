import axios from "axios"
import { Fragment, Component } from "react"

class Home extends Component {

  constructor (props) {
    super(props)
    this.state = {
      last_buy: 0,
      last_sell: 0,
      current_buy: 0,
      current_sell: 0,
      change: 'sama'
    }
  }

  formatCurrency(value) {
    return `Rp. ${Number(value).toLocaleString('id-ID')}`
  }

  fetchData = async (isFirst=false) => {
    const res = await axios.get('https://indodax.com/api/btc_idr/ticker')
    if (isFirst) {
      await this.setState({
        current_buy: res.data.ticker.buy,
        current_sell: res.data.ticker.sell,
        last_buy: res.data.ticker.buy,
        last_sell: res.data.ticker.sell,
      });
    } else {
      await this.setState({
        last_buy: this.state.current_buy,
        last_sell: this.state.current_sell,
        current_buy: res.data.ticker.buy,
        current_sell: res.data.ticker.sell,
      });
      
      let change = "sama"

      if (this.state.last_buy != this.state.current_buy) {

        if (this.state.last_buy < this.state.current_buy) {
          this.playAudio("/static/up.mp3")
          change = 'naik'
        } else {
          this.playAudio("/static/down.mp3")
          change = 'turun'
        }

        this.setState({ change })
      }
    }
  }

  async playAudio(music) {
    let audio = await new Audio(music);
    audio.play()
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, 9800)
  }

  componentDidMount() {
    this.fetchData(true)
    setInterval(this.fetchData, 60000)
  }

  render() {
    return (
      <Fragment>
        <div>Beli: { this.formatCurrency(this.state.current_buy) }</div>
        <div>Jual: {this.formatCurrency(this.state.current_sell)}</div>
        <div>Log: {this.state.change}</div>
        <div>Beli: {this.formatCurrency(this.state.last_buy)} -> {this.formatCurrency(this.state.current_buy)} </div>
        <div>Jual: {this.formatCurrency(this.state.last_sell)} -> {this.formatCurrency(this.state.current_sell)} </div>
      </Fragment>
    )
  }

}


export default Home;