require 'bundler'
Bundler.require
require 'json'

class TestServer < Sinatra::Base
  get '/chunked' do
    headers({
      "Content-type" => "application/octet-stream",
      "Transfer-encoding" => "chunked"
    })
    stream do |out|
      3.times do |i|
        jsonstr = {response: "hoge", count: i}.to_json
        out << jsonstr.size.to_s(16) << "\r\n"
        out << jsonstr << "\r\n"
        sleep(1)
      end
      out << "0\r\n\r\n"
    end
  end

  get '/eventemitter2.js' do
    content_type :js
    File.read('eventemitter2.js')
  end

  get '/main.js' do
    content_type :js
    File.read(File.join('..','index.js'))
  end

  get '/index.html' do
    content_type :html
    File.read('index.html')
  end
  get '/' do
    content_type :html
    File.read('index.html')
  end
end